import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./UserResolver";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import cors from "cors";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";

// Wrapped within a async lambda function to write async and await code.
(async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    // Get access to the express request and response and pass them in the context
    // This allows our graphql resolvers to access these
    context: ({ req, res }) => ({ req, res }),
  });

  const HTTP_PORT = process.env.HTTP_PORT || 8080;

  // Required logic for integrating with Express
  await apolloServer.start();

  const app = express();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(cookieParser()); // this express middleware will parse the cookie string

  await createConnection();

  // Add graphql data to express server
  // ignore the cors that apollo sets
  apolloServer.applyMiddleware({ app, cors: false }); // 'cors: false' turns off apollo's cors settings

  app.get("/", (_req, res) => {
    res.send("hello");
  });

  // This route is used specifically to refresh the jwt token
  // The cookie will only work on this route
  app.post("/refresh_token", async (req, res) => {
    //console.log(req.headers); // print the headers
    //console.log(req.cookies); // print the cookie

    // read the cookie which should contain the refresh token
    const token = req.cookies.jid;

    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    // Valid the refresh token, checks if it has not expired.
    let payload: any = null;

    try {
      // user id will be stored in the payload.
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }

    /** Token is valid and we can send back an access token **/
    // Find the user in the db, and create a new access token.
    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    // check if the token version matches the tokenVersion saved in the user's payload
    if (user.tokenVersion !== payload.tokenVersion) {
      // invalid token
      return res.send({ ok: false, accessToken: "" });
    }

    // Refresh the refresh access token
    sendRefreshToken(res, createRefreshToken(user));

    // return a new access token for that user
    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  app.listen(HTTP_PORT, () => {
    console.log(`Express server is running on port ${HTTP_PORT}`);
  });
})();
