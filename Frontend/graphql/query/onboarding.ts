import { gql } from '@apollo/client';

export const GET_NEW_HIRE_CHECKLIST = gql`
  query GetNewHireChecklist($employeeId: String!) {
    getNewHireChecklist(employeeId: $employeeId) {
      id
      employeeId
      taskId
      taskName
      description
      status
      completedAt
      createdAt
    }
  }
`;

export const GET_ONBOARDING_PROGRESS_SUMMARY = gql`
  query GetOnboardingProgressSummary {
    getOnboardingProgressSummary {
      employeeId
      employeeName
      department
      totalTasks
      completedTasks
      progressPercentage
      startDate
    }
  }
`;

// Made with Bob
