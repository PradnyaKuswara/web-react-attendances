export type Response = Response & {
  statusCode: number;
  message: string;
  data: any;
};

export type ResponsePagination<T> = {
  statusCode: number;
  message: string;
  data: T;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
