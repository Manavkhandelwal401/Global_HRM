import { gql } from '@apollo/client';

export const SWITCH_DEMO_ROLE = gql`
  mutation SwitchDemoRole($userId: ID!, $newRole: EmployeeRole!) {
    switchDemoRole(userId: $userId, newRole: $newRole) {
      id
      email
      role
      firstName
      lastName
      designation
      department
      profilePictureUrl
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      role
      firstName
      lastName
      designation
      department
      profilePictureUrl
    }
  }
`;

// Made with Bob
