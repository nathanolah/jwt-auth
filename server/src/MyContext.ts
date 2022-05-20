import { Request, Response } from "express";

export interface MyContext {
  req: Request;
  res: Response;
  // payload is an optional object hence the '?', which contains the userId if the user is logged in.
  payload?: { userId: string };
}
