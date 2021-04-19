import gql from 'graphql-tag';

export const CREATE_USER_MUTATION = gql`
  mutation createUser($user: UserInput!) {
    createUser(createUserInput: $user) {
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
