import { gql } from '@apollo/client';

export const ASK_HR_COPILOT = gql`
  mutation AskHrCopilot($query: String!, $employeeId: String!) {
    askHrCopilot(query: $query, employeeId: $employeeId) {
      query
      response
      suggestedQuestions
      timestamp
    }
  }
`;

// Made with Bob
