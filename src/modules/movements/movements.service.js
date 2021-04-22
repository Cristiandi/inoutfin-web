import { gql } from 'graphql-request';

import { getClient } from '../../graphql';

class MovementsService {
  async createOutcome ({ userAuthUid, movementCategoryId, amount, description }) {
    const graphQLClient = await getClient();

    const mutation = gql`
      mutation createOutcome (
        $userAuthUid: String!
        $movementCategoryId: Int!
        $amount: Float!
        $description: String!
      ) {
        createOutcomeMovement (
          createOutcomeMovementInput: {
            userAuthUid: $userAuthUid
            movementCategoryId: $movementCategoryId
            amount: $amount
            description: $description
          }
        ) {
          id
          amount
          description
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      userAuthUid,
      movementCategoryId,
      amount,
      description
    };

    const data = await graphQLClient.request(mutation, variables);

    return {
      ...data.createOutcomeMovement,
      message: 'Egreso creado.'
    };
  }
}

export const movementsService = new MovementsService();
