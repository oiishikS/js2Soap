export interface RequestHeaders {
  authentication: Auth;
  session: string;
}

export interface Auth {
  token: string;
  keepAlive: number;
  createdAt: string;
}
