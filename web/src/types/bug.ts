export type Bug = {
  id: number;
  title: string;
  description: string;
  solved: boolean;
};

export type BugData = {
  title: string;
  description: string;
  solved: boolean;
  task: string;
  developer: number;
  project: string;
};
