import { gql, GraphQLClient } from 'graphql-request';

import { getClient } from '../../graphql';
import { auth } from '../../firebase';
// import { sleep } from '../../utils';

class UsersService {
  async register ({ fullName, email, phoneNumber, password, confirmPassword }) {
    console.log('GraphQLClient', GraphQLClient);

    const graphQLClient = await getClient();

    const mutation = gql`
      mutation create (
        $fullName: String!
        $email: String!
        $phone: String!
        $password: String!
      ) {
        createUser (
          createUserInput: {
            fullName: $fullName
            email: $email
            phone: $phone
            password: $password
          }
        ) {
          id
          authUid
          email
          fullName
          phone
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      fullName,
      email,
      password,
      phone: phoneNumber
    };

    const data = await graphQLClient.request(mutation, variables);

    return {
      ...data,
      message: 'Tu usuario fue creado, puedes iniciar sesión.'
    };
  }

  async login ({ email, password }) {
    const { user } = await auth.signInWithEmailAndPassword(email, password);

    return user;
  }

  async logout () {
    if (auth.currentUser) await auth.signOut();
  }
}

export const usersService = new UsersService();
