export type Endpoint = {
  id: string;
  path: string;
  method: string;
  title: string;
  description: string;
  headers?: Header[];
  query?: Query[];
  response: Response;
};

export type Header = {
  key: string;
  required: boolean;
  description: string;
};

export type Query = {
  key: string;
  required: boolean;
  description: string;
};

export type Response = {
  [200]: {
    description: string;
    type: string;
    example: string;
  };
};

export type PublicApiResponse<T> = {
  data: T;
  total?: number;
  offset?: number;
  limit?: number;
};
