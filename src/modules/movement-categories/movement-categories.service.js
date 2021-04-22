import { gql } from 'graphql-request';

import { getClient } from '../../graphql';

class MovementCategoriesService {
  async getAll ({ sign = 1 }) {
    const graphQLClient = await getClient();

    const query = gql`
      query getAll ($sign: Int!) {
        getAllMovementCategories (
          getAllMovementCategoriesInput: {
            sign: $sign
          }
        ) {
          id
          name
          code
          description
          sign
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      sign
    };

    const data = await graphQLClient.request(query, variables);

    return data.getAllMovementCategories;
  }
}

export const movementCategoriesService = new MovementCategoriesService();
