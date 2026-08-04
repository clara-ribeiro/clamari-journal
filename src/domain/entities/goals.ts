export type Goals = {
  year: number;
  movies: number;
  books: number;
  series: number;
  pages: number;
};

export type GoalProgress = {
  key: keyof Omit<Goals, "year">;
  label: string;
  current: number;
  target: number;
  percent: number;
  remaining: number;
};
