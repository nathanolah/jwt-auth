import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  from,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getAccessToken, setAccessToken } from './accessToken';
import { App } from './App';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
  credentials: "include"
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log(graphQLErrors)
  console.log(networkError)
});

const requestLink = setContext((_, { headers }) => {
  // get the authentication token
  const token = getAccessToken();

  console.log("set context token : " + token)

  if (token) {
    return {
      headers: {
        ...headers,
        authorization: token ? `bearer ${token}` : "",
      }
    }
  }
});

const jwtRefreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
      isTokenValidOrUndefined: () => {
        const token = getAccessToken();

        if (!token) {
          return true;
        }
        
        try {
          const exp : number = jwtDecode(token);
          
          if (Date.now() >= exp * 1000) {
            return true;
            
          } else {
            return false;
          }

        } catch {
          return false;
        }

      },
      fetchAccessToken: () => {
        return fetch('http://localhost:8080/refresh_token', {
          method: 'POST',
          credentials: 'include'
        });
      },
      handleFetch: accessToken => {
        setAccessToken(accessToken);
      },
      handleError: err => {
         // full control over handling token fetch Error
         console.warn('Your refresh token is invalid. Try to relogin');
         console.error(err);
      }
});

const client = new ApolloClient({
  link: from([errorLink, jwtRefreshLink, requestLink, httpLink]),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
