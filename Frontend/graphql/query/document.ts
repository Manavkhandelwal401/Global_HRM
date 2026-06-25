import { gql } from '@apollo/client';

export const GET_MY_DOCUMENTS = gql`
  query GetMyDocuments($employeeId: String!) {
    getMyDocuments(employeeId: $employeeId) {
      id
      employeeId
      employeeName
      category
      name
      url
      expiryDate
      status
      rejectionReason
      createdAt
      updatedAt
    }
  }
`;

// Made with Bob