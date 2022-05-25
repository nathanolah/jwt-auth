## Token Authentication & Authorization

### Full Stack application integrated with JWT

This app follows a token-based design used to secure access to specific GraphQL endpoints.

This token-based design issues an access token and refresh token to a client.

After successful login the server issues an access token used on the client side to make secure GraphQL requests.

A refresh token is also issued and stored in a cookie which allows the client to obtain a new access token without having to log in again.

## Architecture
### Backend
- Express - server
- GraphQL - query language
- JSON Web Token - Authentication & Authorization
- TypeORM - ORM framework
- PostgreSQL - database
- Apollo Server - GraphQL server

### Frontend
- React
- Apollo Client
- Apollo link token refresh
- JWT decode
- GraphQL
- GraphQL Codegen

