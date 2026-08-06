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
  percent: number;
  remaining: number;
};
