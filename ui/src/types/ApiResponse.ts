export type ApiMessage = {
  code: number;
  text: string;
};

export type ApiResponse<T> = {
  data: T;
  messages: ApiMessage[];
};
