import { describe, expect, it } from "vitest";
import { memoizeByCalendarDay } from "./calendar-day-memo";

describe("memoizeByCalendarDay", () => {
  it("recomputes only when the calendar day changes", () => {
    let today = "2026-09-15";
    let runs = 0;
    const read = memoizeByCalendarDay((day) => {
      runs += 1;
      return `live-${day}-${runs}`;
    }, () => today);

    expect(read()).toBe("live-2026-09-15-1");
    expect(read()).toBe("live-2026-09-15-1");
    today = "2026-09-16";
    expect(read()).toBe("live-2026-09-16-2");
    expect(read()).toBe("live-2026-09-16-2");
    expect(runs).toBe(2);
  });
});
