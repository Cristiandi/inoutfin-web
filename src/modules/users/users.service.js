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

  async update ({ fullName, authUid }) {
    const graphQLClient = await getClient();

    const mutation = gql`
      mutation update (
        $authUid: String!
        $fullName: String!
      ) {
        updateUser (
          updateUserInput: {
            authUid: $authUid
            fullName: $fullName
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
      authUid
    };

    const data = await graphQLClient.request(mutation, variables);

    return {
      ...data,
      message: 'Tus datos han sido actualizados.'
    };
  }

  async changeEmail ({ authUid, email }) {
    const graphQLClient = await getClient();

    const mutation = gql`
      mutation change (
        $authUid: String!
        $email: String!
      ) {
        changeUserEmail (
          changeUserEmailInput: {
            authUid: $authUid,
            email: $email
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
      authUid,
      email
    };

    const data = await graphQLClient.request(mutation, variables);

    return {
      ...data,
      message: 'El email ha sido actualizado, tú sesión se cerrará.'
    };
  }

  async changePassword ({ authUid, oldPassword, newPassword }) {
    const graphQLClient = await getClient();

    const mutation = gql`
      mutation change (
        $authUid: String!
        $oldPassword: String!
        $newPassword: String!
      ) {
        changeUserPassword (
          changeUserPasswordInput: {
            authUid: $authUid,
            oldPassword: $oldPassword
            newPassword: $newPassword
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
      authUid,
      oldPassword,
      newPassword
    };

    const data = await graphQLClient.request(mutation, variables);

    return {
      ...data,
      message: 'Tú clave ha sido cambiada.'
    };
  }

  async login ({ email, password }) {
    const { user } = await auth.signInWithEmailAndPassword(email, password);

    if (!user.emailVerified) {
      await this.logout();
      throw new Error(`the user does not verified the email ${email}`);
    }

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
