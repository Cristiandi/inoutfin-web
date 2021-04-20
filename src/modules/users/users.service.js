import { gql } from 'graphql-request';

import { getClient } from '../../graphql';
import { auth } from '../../firebase';
// import { sleep } from '../../utils';

class UsersService {
  async register ({ fullName, email, phoneNumber, password }) {
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

  async myInfo ({ authUid }) {
    const graphQLClient = await getClient();

    const query = gql`
      query getByAuthUid ($authUid: String!) {
        getUserByAuthUid (
          getUserByAuthUidInput: {
            authUid: $authUid
          }
        ) {
          id
          authUid
          fullName
          email
          phone
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      authUid
    };

    const data = await graphQLClient.request(query, variables);

    if (!data.getUserByAuthUid) {
      throw new Error('myInfo | can\'t get the data.getUserByAuthUid.');
    }

    return data.getUserByAuthUid;
  }

  async resetPassword ({ email }) {
    const graphQLClient = await getClient();

    const mutation = gql`
      mutation resetPassword ($email: String!) {
        resetUserPassword (
          resetUserPasswordInput: {
            email: $email
          }
        )
      }
    `;

    const variables = {
      email
    };

    await graphQLClient.request(mutation, variables);

    return {
      message: 'Te enviamos un correo!'
    };
  }
}

export const usersService = new UsersService();
