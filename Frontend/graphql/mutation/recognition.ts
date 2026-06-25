import { gql } from '@apollo/client';

export const NOMINATE_PEER = gql`
  mutation NominatePeer(
    $nomineeId: String!
    $coreValue: String!
    $reason: String!
    $points: Int!
    $nominatorId: String!
  ) {
    nominatePeer(
      nomineeId: $nomineeId
      coreValue: $coreValue
      reason: $reason
      points: $points
      nominatorId: $nominatorId
    ) {
      id
      nominatorId
      nominatorName
      nomineeId
      nomineeName
      coreValue
      reason
      points
      status
      createdAt
    }
  }
`;

export const APPROVE_NOMINATION = gql`
  mutation ApproveNomination(
    $nominationId: String!
    $approverId: String!
    $comments: String
  ) {
    approveNomination(
      nominationId: $nominationId
      approverId: $approverId
      comments: $comments
    ) {
      id
      status
      approvedBy
      approvedByName
      approvedOn
    }
  }
`;

// Made with Bob
