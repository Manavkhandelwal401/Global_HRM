import { gql } from '@apollo/client';

export const CREATE_ONBOARDING_CHECKLIST = gql`
  mutation CreateOnboardingChecklist($employeeId: String!, $role: String!) {
    createOnboardingChecklist(employeeId: $employeeId, role: $role) {
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

export const TOGGLE_ONBOARDING_TASK = gql`
  mutation ToggleOnboardingTask($checklistId: String!, $isCompleted: Boolean!) {
    toggleOnboardingTask(checklistId: $checklistId, isCompleted: $isCompleted) {
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

// Made with Bob
