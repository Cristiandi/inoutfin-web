import { GraphQLClient } from 'graphql-request';

import enviroment from '../environment';
import { auth } from '../firebase';

export const getClient = async () => {
  let headers = {};

  if (auth.currentUser) {
    const { token } = await auth.currentUser.getIdTokenResult();

    headers = {
      ...headers,
      authorization: `Bearer ${token}`
    };
  }

  const graphQLClient = new GraphQLClient(enviroment.GRAPHQL_ENDPOINT, {
    headers
  });

  return graphQLClient;
};
