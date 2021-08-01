import { gql } from 'graphql-request';

import { getClient } from '../../graphql';

import { currencyFormat, dateFormat } from '../../utils';

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

  async createIncome ({ userAuthUid, movementCategoryId, amount, description }) {
    const graphQLClient = await getClient();

    const mutation = gql`
      mutation createIncome (
        $userAuthUid: String!
        $movementCategoryId: Int!
        $amount: Float!
        $description: String!
      ) {
        createIncomeMovement (
          createIncomeMovementInput: {
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
      ...data.createIncomeMovement,
      message: 'Ingreso creado.'
    };
  }

  async getBalanceResume ({ userAuthUid }) {
    const graphQLClient = await getClient();

    const query = gql`
      query getResume (
        $userAuthUid: String!
      ) {
        getBalanceResume (
          getBalanceResumeInput: {
            userAuthUid: $userAuthUid
          }
        ) {
          amount
        }
      }
    `;

    const variables = {
      userAuthUid
    };

    const data = await graphQLClient.request(query, variables);

    return {
      ...data.getBalanceResume
    };
  }

  async getAll ({ userAuthUid, limit, skip }) {
    const graphQLClient = await getClient();

    const query = gql`
      query getAll (
        $userAuthUid: String!
        $limit: Int
        $skip: Int
      ) {
        getAllMovements (
          getAllMovementsInput: {
            userAuthUid: $userAuthUid
            limit: $limit
            skip: $skip
          }
        ) {
            id
            description
            amount
            createdAt
            updatedAt
            movementType {
                id
                code
                name
                sign
            }
            movementCategory {
                id
                code
                name
                description
                sign
            }
            imageUrl
        }
      }
    `;

    const variables = {
      userAuthUid,
      limit,
      skip
    };

    const data = await graphQLClient.request(query, variables);

    return [
      ...data.getAllMovements.map((movement) => {
        return {
          ...movement,
          amount: currencyFormat(movement.amount),
          createdAt: dateFormat(new Date(movement.createdAt))
        };
      })
    ];
  }

  async getOne ({ userAuthUid, id }) {
    const graphQLClient = await getClient();

    const query = gql`
      query getOne (
        $userAuthUid: String!
        $id: Int!
      ) {
        getOneMovement (
          getOneMovementInput: {
            userAuthUid: $userAuthUid
            id: $id
          }
        ) {
          id
          description
          amount
          signedAmount
          closed
          cloudId
          imageUrl
          createdAt
          updatedAt
          movementType {
              id
              code
              name
              sign
          }
          movementCategory {
              id
              code
              name
              description
              sign
          }
        }
      }
    `;

    const variables = {
      userAuthUid,
      id
    };

    const data = await graphQLClient.request(query, variables);

    return {
      ...data.getOneMovement
    };
  }

  async updateIncome ({ userAuthUid, id, description, amount, closed, movementCategoryId }) {
    const graphQLClient = await getClient();

    const mutation = gql`
      mutation updateIncome (
        $userAuthUid: String!
        $id: Int!
        $description: String
        $amount: Float
        $closed: Boolean
        $movementCategoryId: Int
      ) {
        updateIncomeMovement (
          getOneMovementInput: {
            userAuthUid: $userAuthUid
            id: $id
          }
          updateIncomeMovementInput: {
            description: $description
            amount: $amount
            closed: $closed
            movementCategoryId: $movementCategoryId
          }
        ) {
          id
          description
          amount
          closed
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      userAuthUid,
      id,
      description,
      amount,
      closed,
      movementCategoryId
    };

    const data = await graphQLClient.request(mutation, variables);

    return {
      ...data.updateIncomeMovement,
      message: 'Ingreso actualizado.'
    };
  }

  async updateOutcome ({ userAuthUid, id, description, amount, closed, movementCategoryId }) {
    const graphQLClient = await getClient();

    const mutation = gql`
      mutation updateOutcome (
        $userAuthUid: String!
        $id: Int!
        $description: String
        $amount: Float
        $closed: Boolean
        $movementCategoryId: Int
      ) {
        updateOutcomeMovement (
          getOneMovementInput: {
            userAuthUid: $userAuthUid
            id: $id
          }
          updateOutcomeMovementInput: {
            description: $description
            amount: $amount
            closed: $closed
            movementCategoryId: $movementCategoryId
          }
        ) {
          id
          description
          amount
          closed
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      userAuthUid,
      id,
      description,
      amount,
      closed,
      movementCategoryId
    };

    const data = await graphQLClient.request(mutation, variables);

    return {
      ...data.updateOutcomeMovement,
      message: 'Egreso actualizado.'
    };
  }

  async remove ({ userAuthUid, id }) {
    const graphQLClient = await getClient();

    const mutation = gql`
      mutation remove (
        $userAuthUid: String!
        $id: Int!
      ) {
        removeMovement (
          getOneMovementInput: {
            userAuthUid: $userAuthUid
            id: $id
          }
        ) {
          id
          description
          amount
          closed
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      userAuthUid,
      id
    };

    const data = await graphQLClient.request(mutation, variables);

    return {
      ...data.removeMovement,
      message: 'Eliminado.'
    };
  }

  async uploadFile ({ userAuthUid, id, file }) {
    const graphQLClient = await getClient();

    const mutation = gql`
      mutation uploadFile (
        $userAuthUid: String!
        $id: Int!
        $file: Upload!
      ) {
        uploadMovementImage (
          getOneMovementInput: {
            userAuthUid: $userAuthUid
            id: $id
          }
          file: $file
        ) {
          id
          imageUrl
        }
      }
    `;

    const variables = {
      userAuthUid,
      id,
      file
    };

    const data = await graphQLClient.request(mutation, variables);

    return {
      ...data.uploadMovementImage
    };
  }

  async getIncomeVsOutcome ({ userAuthUid }) {
    const graphQLClient = await getClient();

    const query = gql`
      query getIncomeVsOutcome (
        $userAuthUid: String!
      ) {
        getIncomeOutcomeByMonth (
          getIncomeOutcomeByMonthInput: {
            userAuthUid: $userAuthUid
          }
        ) {
          month
          income
          outcome
        }
      }
    `;

    const variables = {
      userAuthUid
    };

    const data = await graphQLClient.request(query, variables);

    return [
      ...data.getIncomeOutcomeByMonth
    ];
  }

  async getOutcomePerCategories ({ userAuthUid, startDate, endDate }) {
    const graphQLClient = await getClient();

    const query = gql`
      query getOutcomePerCategories (
        $userAuthUid: String!
        $startDate: String!
        $endDate: String!
      ) {
        getOutcomePerCategories (
          getOutcomePerCategoriesInput: {
            userAuthUid: $userAuthUid
            starDate: $startDate
            endDate: $endDate
          }
        ) {
          movementCategoryId
          movementCategoryName
          percentage
        }
      }
    `;

    const variables = {
      userAuthUid,
      startDate: startDate + ' 00:00:00',
      endDate: endDate + ' 23:59:59'
    };

    const data = await graphQLClient.request(query, variables);

    return [
      ...data.getOutcomePerCategories
    ];
  }
}

export const movementsService = new MovementsService();
