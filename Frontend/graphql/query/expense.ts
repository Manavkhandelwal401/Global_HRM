import { gql } from '@apollo/client';

export const GET_MY_EXPENSES = gql`
  query GetMyExpenses($employeeId: String!) {
    getMyExpenses(employeeId: $employeeId) {
      id
      employeeId
      employeeName
      category
      amount
      currency
      date
      status
      comments
      approvedBy
      approvedByName
      approvedOn
      createdAt
    }
  }
`;

export const GET_PENDING_EXPENSE_APPROVALS = gql`
  query GetPendingExpenseApprovals($managerId: String!) {
    getPendingExpenseApprovals(managerId: $managerId) {
      id
      employeeId
      employeeName
      category
      amount
      currency
      date
      status
      comments
      approvedBy
      approvedByName
      approvedOn
      createdAt
    }
  }
`;

// Made with Bob