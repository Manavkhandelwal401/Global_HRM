import { gql } from '@apollo/client';

export const SUBMIT_RESIGNATION = gql`
  mutation SubmitResignation($reason: String!, $lastWorkingDate: DateTime!) {
    submitResignation(reason: $reason, lastWorkingDate: $lastWorkingDate) {
      id
      employeeId
      submissionDate
      lastWorkingDate
      reason
      status
      approvedBy
      approvedOn
    }
  }
`;

export const UPDATE_RESIGNATION_STATUS = gql`
  mutation UpdateResignationStatus(
    $resignationId: String!
    $status: String!
    $lastWorkingDate: DateTime
  ) {
    updateResignationStatus(
      resignationId: $resignationId
      status: $status
      lastWorkingDate: $lastWorkingDate
    ) {
      id
      employeeId
      submissionDate
      lastWorkingDate
      reason
      status
      approvedBy
      approvedOn
    }
  }
`;

export const TOGGLE_CLEARANCE_STATUS = gql`
  mutation ToggleClearanceStatus($clearanceId: String!, $isCleared: Boolean!) {
    toggleClearanceStatus(clearanceId: $clearanceId, isCleared: $isCleared) {
      id
      employeeId
      department
      itemName
      status
      clearedBy
      clearedOn
    }
  }
`;

export const SUBMIT_EXIT_FEEDBACK = gql`
  mutation SubmitExitFeedback($feedbackJson: String!) {
    submitExitFeedback(feedbackJson: $feedbackJson) {
      id
      employeeId
      feedbackJson
      createdAt
    }
  }
`;

// Made with Bob
