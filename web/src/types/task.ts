export type Task = {
  id: number;
  title: string;
  description: string;
  complete: boolean;
};

export type TaskData = {
  creator_id: number;
  title: string;
  description: string;
  complete: boolean;
  project: string;
  developers: number[];
};
