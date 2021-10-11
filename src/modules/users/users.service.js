import { gql } from 'graphql-request';

import { getClient } from '../../graphql';
import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  googleAuthProvider,
  getAdditionalUserInfo
} from '../../firebase';
import { setFirebaseProviderId, sleep } from '../../utils';

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
      ...data.createUser,
      message: 'Tu usuario fue creado, puedes iniciar sesión.'
    };
  }

  async registerFromAuthUid ({ authUid, email, fullName, phone }) {
    const graphQLClient = await getClient();

    const mutation = gql`
      mutation register (
        $authUid: String!
        $email: String!
        $fullName: String!
        $phone: String
      ) {
        createUserFromAuthUid (
          createUserFromAuthUidInput: {
            authUid: $authUid
            email: $email
            fullName: $fullName
            phone: $phone
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
      email,
      fullName,
      phone
    };

    const data = await graphQLClient.request(mutation, variables);

    // console.log('USER FROM AUTHUID REGISTRED!');

    return {
      ...data.createUserFromAuthUid
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
      ...data.updateUser,
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
      ...data.changeUserEmail,
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
      ...data.changeUserPassword,
      message: 'Tú clave ha sido cambiada.'
    };
  }

  async changePhone ({ authUid, phone }) {
    const graphQLClient = await getClient();

    const mutation = gql`
      mutation change (
        $authUid: String!
        $phone: String!
      ) {
        changeUserPhone (
          changeUserPhoneInput: {
            authUid: $authUid,
            phone: $phone
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
      phone
    };

    const data = await graphQLClient.request(mutation, variables);

    return {
      ...data.changeUserPhone,
      message: 'Tú télefono ha sido actualizado.'
    };
  }

  async login ({ email, password }) {
    const result = await signInWithEmailAndPassword(auth, email, password);

    console.log('LOGIN RESULT', result);

    const { user } = result;

    if (!user.emailVerified) {
      await this.logout();
      throw new Error(`the user does not verified the email ${email}`);
    }

    const { providerId } = user;

    console.log('providerId', providerId);

    setFirebaseProviderId(providerId);

    return result.user;
  }

  async loginWithGoogle () {
    // console.log('LOGIN WITH GOOGLE');

    googleAuthProvider.setCustomParameters({
      prompt: 'select_account'
    });

    googleAuthProvider.addScope('profile');
    googleAuthProvider.addScope('email');

    const result = await signInWithPopup(auth, googleAuthProvider);

    const additionalUserInfo = await getAdditionalUserInfo(result);

    const { isNewUser } = additionalUserInfo;

    const { user } = result;

    if (isNewUser) {
      // console.log('NEW USER');
      const authUid = user.uid;
      const email = user.email;
      const fullName = additionalUserInfo.profile.name || user.displayName;
      const phone = user.phoneNumber || null;

      await this.registerFromAuthUid({
        authUid,
        email,
        fullName,
        phone
      });
    }

    console.log('LOGIN WITH GOOGLE RESULT', result);

    setFirebaseProviderId(result.providerId);

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

    const LIMIT = 50;
    let tries = 0;

    let data;

    do {
      try {
        data = await graphQLClient.request(query, variables);

        break;
      } catch (error) {
        tries += 1;
        console.error('tries', tries);

        if (tries === LIMIT) {
          throw error;
        }
      }

      await sleep(500);
    } while (tries <= LIMIT);

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
