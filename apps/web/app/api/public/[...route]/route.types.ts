export type Endpoint = {
  id: string;
  path: string;
  method: string;
  title: string;
  description: string;
  headers: Header[];
  response: Response;
};

export type Header = {
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
