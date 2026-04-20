import type { Response } from './response';

export type FileResponse = Response & {
  data: {
    key: string;
    url: string;
  };
};
