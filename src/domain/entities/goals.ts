export type Goals = {
  year: number;
  movies: number;
  books: number;
  series: number;
  pages: number;
};

/** Progress toward a yearly goal — labels come from content/copy at the UI edge. */
export type GoalProgress = {
  key: keyof Omit<Goals, "year">;
  current: number;
  target: number;
  /** Fill amount for the gauge, clamped 0–100. */
  percent: number;
  /** True when current is strictly above the target. */
  exceeded: boolean;
  remaining: number;
};
