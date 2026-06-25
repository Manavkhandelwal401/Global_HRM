import { gql } from '@apollo/client';

export const SUBMIT_EXPENSE = gql`
  mutation SubmitExpense(
    $employeeId: String!
    $category: ReimbursementCategory!
    $amount: Decimal!
    $currency: String!
    $date: DateTime!
    $comments: String
  ) {
    submitExpense(
      employeeId: $employeeId
      category: $category
      amount: $amount
      currency: $currency
      date: $date
      comments: $comments
    ) {
      id
      employeeId
      category
      amount
      currency
      date
      status
      comments
      createdAt
    }
  }
`;

export const APPROVE_EXPENSE = gql`
  mutation ApproveExpense(
    $expenseId: String!
    $approverId: String!
    $comments: String
  ) {
    approveExpense(
      expenseId: $expenseId
      approverId: $approverId
      comments: $comments
    ) {
      id
      status
      comments
      approvedBy
      approvedOn
    }
  }
`;

export const REJECT_EXPENSE = gql`
  mutation RejectExpense(
    $expenseId: String!
    $approverId: String!
    $comments: String
  ) {
    rejectExpense(
      expenseId: $expenseId
      approverId: $approverId
      comments: $comments
    ) {
      id
      status
      comments
      approvedBy
      approvedOn
    }
  }
`;

// Made with Bob