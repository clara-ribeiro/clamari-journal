#!/usr/bin/env python3
"""Tests for TV Time GDPR rating-id mapping in import-tvtime.py."""

from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path
from types import ModuleType


def load_importer() -> ModuleType:
    path = Path(__file__).with_name("import-tvtime.py")
    spec = importlib.util.spec_from_file_location("import_tvtime", path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


tvtime = load_importer()


class TvTimeStarMappingTest(unittest.TestCase):
    def test_stars_wording_scalev2_ids(self) -> None:
        to_stars = tvtime.tvtime_stars_from_vote_key
        self.assertEqual(to_stars("uuid-user-1"), 1)
        self.assertEqual(to_stars("uuid-user-27"), 2)
        self.assertEqual(to_stars("uuid-user-28"), 3)
        self.assertEqual(to_stars("uuid-user-29"), 4)
        self.assertEqual(to_stars("uuid-user-3"), 5)

    def test_skips_emotion_ids_and_junk(self) -> None:
        to_stars = tvtime.tvtime_stars_from_vote_key
        self.assertIsNone(to_stars("uuid-user-32"))
        self.assertIsNone(to_stars("uuid-user-39"))
        self.assertIsNone(to_stars(""))
        self.assertIsNone(to_stars("not-a-rating"))

    def test_remap_corrects_existing_ratings_only(self) -> None:
        movies = [
            {"tvtimeUuid": "a", "title": "Was three", "rating": 3},
            {"tvtimeUuid": "b", "title": "Unrated"},
            {"title": "Manual", "rating": 4},
        ]
        updated, remapped = tvtime.remap_existing_ratings(
            movies,
            {"a": 5, "b": 4},
        )
        self.assertEqual(updated, 1)
        self.assertEqual(remapped, 1)
        self.assertEqual(movies[0]["rating"], 5)
        self.assertNotIn("rating", movies[1])
        self.assertEqual(movies[2]["rating"], 4)


if __name__ == "__main__":
    unittest.main()
