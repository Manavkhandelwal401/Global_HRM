import { gql } from '@apollo/client';

export const GET_RECOGNITION_FEED = gql`
  query GetRecognitionFeed {
    getRecognitionFeed {
      id
      nominatorId
      nominatorName
      nomineeId
      nomineeName
      coreValue
      reason
      points
      status
      approvedBy
      approvedByName
      approvedOn
      createdAt
    }
  }
`;

export const GET_MY_RECOGNITION_POINTS = gql`
  query GetMyRecognitionPoints($employeeId: String!) {
    getMyRecognitionPoints(employeeId: $employeeId)
  }
`;

// Made with Bob
