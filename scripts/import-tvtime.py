#!/usr/bin/env python3
"""
Import TV Time GDPR export into clamari-journal data files.

Usage:
  python3 scripts/import-tvtime.py
  python3 scripts/import-tvtime.py /path/to/gdpr-data.zip
  python3 scripts/import-tvtime.py /path/to/extracted-folder

Default source: src/data/gdpr-data.zip

Only uses the files needed for personal journal entries:
  - followed_tv_show.csv
  - user_tv_show_data.csv
  - user_show_special_status.csv
  - tv_show_rate.csv
  - tracking-prod-records.csv      (movies)
  - tracking-prod-records-v2.csv   (episodes)
  - ratings-live-votes.csv         (movie ratings 1–5)
  - lists-prod-lists.csv           (favorite-movies / favorite-series)
"""

from __future__ import annotations

import csv
import json
import re
import sys
import zipfile
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "src" / "data"
DEFAULT_SOURCE = DATA_DIR / "gdpr-data.zip"


def slugify(text: str) -> str:
    text = text.lower().strip()
    repl = str.maketrans(
        "áàâãäéèêëíìîïóòôõöúùûüçñ",
        "aaaaaeeeeiiiiooooouuuucn",
    )
    text = text.translate(repl)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "untitled"


def unique_slug(base: str, used: set[str]) -> str:
    slug = base
    i = 2
    while slug in used:
        slug = f"{base}-{i}"
        i += 1
    used.add(slug)
    return slug


def open_csv(source: Path, name: str):
    if source.is_file() and source.suffix == ".zip":
        with zipfile.ZipFile(source) as zf:
            with zf.open(name) as raw:
                text = raw.read().decode("utf-8").splitlines()
        return csv.DictReader(text)
    path = source / name
    return csv.DictReader(path.open(encoding="utf-8"))


def load_rows(source: Path, name: str) -> list[dict]:
    return list(open_csv(source, name))


def load_favorite_lists(source: Path) -> tuple[set[str], set[str]]:
    """Return (favorite movie uuids, favorite series tvdb ids) from lists-prod-lists.csv."""
    movie_uuids: set[str] = set()
    series_ids: set[str] = set()
    try:
        rows = load_rows(source, "lists-prod-lists.csv")
    except (FileNotFoundError, KeyError):
        return movie_uuids, series_ids

    for row in rows:
        key = row.get("s_key") or ""
        objects = row.get("objects") or ""
        if key == "favorite-movies":
            movie_uuids.update(re.findall(r"uuid:([0-9a-f-]+)", objects))
        elif key == "favorite-series":
            series_ids.update(re.findall(r"id:(\d+)\s+type:series", objects))
    return movie_uuids, series_ids


def dedupe_episodes(eps: list[dict]) -> list[dict]:
    best: dict[tuple[int, int], dict] = {}
    for e in eps:
        key = (e["season"], e["episode"])
        if key not in best:
            entry = {
                "season": e["season"],
                "episode": e["episode"],
                "watchedAt": e.get("watchedAt"),
            }
            if e.get("runtimeMinutes"):
                entry["runtimeMinutes"] = e["runtimeMinutes"]
            best[key] = entry
        else:
            a, b = best[key].get("watchedAt"), e.get("watchedAt")
            if a and b and b < a:
                best[key]["watchedAt"] = b
            elif not a and b:
                best[key]["watchedAt"] = b
            if e.get("runtimeMinutes") and not best[key].get("runtimeMinutes"):
                best[key]["runtimeMinutes"] = e["runtimeMinutes"]
    return sorted(best.values(), key=lambda x: (x["season"], x["episode"]))


def infer_series_status(eps, followed_info, nb_seen: int) -> str:
    if followed_info and followed_info.get("archived"):
        return "abandoned" if nb_seen > 0 else "watchlist"
    if not eps and nb_seen == 0:
        return "watchlist"
    if not eps:
        return "watching"
    dates = [e["watchedAt"] for e in eps if e.get("watchedAt")]
    latest = max(dates) if dates else None
    if latest and latest >= "2026-01-01":
        return "watching"
    if latest and latest >= "2025-01-01":
        return "paused"
    if latest and latest < "2024-01-01":
        return "completed" if nb_seen >= 5 else "abandoned"
    return "paused"


def build_series(source: Path) -> list[dict]:
    favorites = {
        r["tv_show_id"]
        for r in load_rows(source, "user_show_special_status.csv")
        if r["status"] == "favorite"
    }
    _, list_favorite_series = load_favorite_lists(source)
    favorites |= list_favorite_series
    show_ratings = {
        r["tv_show_id"]: float(r["rating"])
        for r in load_rows(source, "tv_show_rate.csv")
    }
    followed = {
        r["tv_show_id"]: {
            "name": r["tv_show_name"],
            "created_at": r["created_at"][:10],
            "archived": r["archived"] == "1",
        }
        for r in load_rows(source, "followed_tv_show.csv")
    }
    show_data = {
        r["tv_show_id"]: {
            "name": r["tv_show_name"],
            "nb_seen": int(r["nb_episodes_seen"] or 0),
            "is_favorited": r["is_favorited"] == "1",
        }
        for r in load_rows(source, "user_tv_show_data.csv")
    }

    series_eps: dict[str, list] = defaultdict(list)
    series_meta: dict[str, str] = {}
    for row in load_rows(source, "tracking-prod-records-v2.csv"):
        key = row.get("key", "")
        sid = row.get("s_id") or ""
        if not sid:
            continue
        if key.startswith("watch-episode") or key.startswith("rewatch-episode"):
            season = int(row["season_number"] or row.get("s_no") or 0)
            ep = int(row["episode_number"] or row.get("ep_no") or 0)
            date = (row.get("created_at") or "")[:10] or None
            if season <= 0 or ep <= 0:
                continue
            episode = {"season": season, "episode": ep, "watchedAt": date}
            runtime_raw = row.get("runtime") or ""
            if runtime_raw.isdigit() and int(runtime_raw) > 0:
                episode["runtimeMinutes"] = round(int(runtime_raw) / 60)
            series_eps[sid].append(episode)
            if row.get("series_name"):
                series_meta[sid] = row["series_name"]
        elif key.startswith("user-series") and row.get("series_name"):
            series_meta[sid] = row["series_name"]

    all_sids = set(show_data) | set(followed) | set(series_eps)
    used_slugs: set[str] = set()
    entries: list[dict] = []

    for sid in sorted(all_sids, key=lambda x: int(x) if x.isdigit() else 0):
        name = (
            show_data.get(sid, {}).get("name")
            or followed.get(sid, {}).get("name")
            or series_meta.get(sid)
            or f"series-{sid}"
        )
        eps = dedupe_episodes(series_eps.get(sid, []))
        nb = show_data.get(sid, {}).get("nb_seen", len(eps))
        status = infer_series_status(eps, followed.get(sid), nb)
        dates = [e["watchedAt"] for e in eps if e.get("watchedAt")]

        entry: dict = {
            "tvdbId": int(sid),
            "slug": unique_slug(slugify(name), used_slugs),
            "title": name,
            "status": status,
            "favorite": sid in favorites
            or show_data.get(sid, {}).get("is_favorited", False),
            "watchedEpisodes": eps,
        }
        if sid in show_ratings:
            entry["rating"] = show_ratings[sid]
        if dates:
            entry["startedAt"] = min(dates)
            if status == "completed":
                entry["finishedAt"] = max(dates)
        elif sid in followed:
            entry["startedAt"] = followed[sid]["created_at"]
        entries.append(entry)

    return entries


def build_movies(source: Path) -> list[dict]:
    favorite_movie_uuids, _ = load_favorite_lists(source)
    movies_by_uuid: dict[str, dict] = {}
    for row in load_rows(source, "tracking-prod-records.csv"):
        if not row.get("movie_name"):
            continue
        uid = row["uuid"]
        m = movies_by_uuid.setdefault(
            uid,
            {
                "uuid": uid,
                "title": row["movie_name"],
                "runtimeSeconds": None,
                "releaseDate": None,
                "watchedDates": [],
                "isWatchlist": False,
                "hasWatch": False,
            },
        )
        if row.get("runtime"):
            try:
                m["runtimeSeconds"] = int(row["runtime"])
            except ValueError:
                pass
        if row.get("release_date"):
            m["releaseDate"] = row["release_date"][:10]
        if row["type"] == "towatch":
            m["isWatchlist"] = True
        if row["type"] in {"watch", "rewatch"}:
            m["hasWatch"] = True
            date = (row.get("created_at") or "")[:10]
            if date:
                m["watchedDates"].append(date)

    movie_ratings: dict[str, float] = {}
    for row in load_rows(source, "ratings-live-votes.csv"):
        score = int(row["vote_key"].rsplit("-", 1)[-1])
        if 1 <= score <= 5:
            movie_ratings[row["uuid"]] = float(score)

    used_slugs: set[str] = set()
    entries: list[dict] = []
    for uid, m in sorted(movies_by_uuid.items(), key=lambda x: x[1]["title"].lower()):
        if not m["hasWatch"] and not m["isWatchlist"]:
            continue
        dates = sorted(set(d for d in m["watchedDates"] if d))
        status = "watched" if m["hasWatch"] else "watchlist"
        if len(dates) > 1:
            status = "rewatch"
        entry: dict = {
            "tvtimeUuid": uid,
            "slug": unique_slug(slugify(m["title"]), used_slugs),
            "title": m["title"],
            "status": status,
        }
        if uid in favorite_movie_uuids:
            entry["favorite"] = True
        if m["releaseDate"]:
            entry["releaseDate"] = m["releaseDate"]
        if m["runtimeSeconds"]:
            entry["runtimeMinutes"] = round(m["runtimeSeconds"] / 60)
        if dates:
            entry["watchedDates"] = dates
        if uid in movie_ratings:
            entry["rating"] = movie_ratings[uid]
        entries.append(entry)

    return entries


def main() -> int:
    if len(sys.argv) > 2:
        print(__doc__)
        return 1

    source = (
        Path(sys.argv[1]).expanduser().resolve()
        if len(sys.argv) == 2
        else DEFAULT_SOURCE
    )
    if not source.exists():
        print(f"Source not found: {source}")
        print(f"Place the TV Time export at {DEFAULT_SOURCE} or pass a path.")
        return 1

    print(f"Importing from {source}")

    series = build_series(source)
    movies = build_movies(source)

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    (DATA_DIR / "series.json").write_text(
        json.dumps(series, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    (DATA_DIR / "movies.json").write_text(
        json.dumps(movies, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Wrote {len(series)} series → src/data/series.json")
    print(f"Wrote {len(movies)} movies → src/data/movies.json")
    print(
        f"Episodes: {sum(len(s['watchedEpisodes']) for s in series)} unique watched"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
