import { gql } from '@apollo/client';

export const GET_MY_RESIGNATION_DETAILS = gql`
  query GetMyResignationDetails {
    getMyResignationDetails {
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

export const GET_MY_CLEARANCE_STATUS = gql`
  query GetMyClearanceStatus {
    getMyClearanceStatus {
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

export const GET_PENDING_OFFBOARDING_REQUESTS = gql`
  query GetPendingOffboardingRequests {
    getPendingOffboardingRequests {
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

export const GET_ALL_CLEARANCE_ITEMS = gql`
  query GetAllClearanceItems($employeeId: String!) {
    getAllClearanceItems(employeeId: $employeeId) {
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

export const GET_EXIT_INTERVIEW = gql`
  query GetExitInterview($employeeId: String!) {
    getExitInterview(employeeId: $employeeId) {
      id
      employeeId
      feedbackJson
      createdAt
    }
  }
`;

// Made with Bob
