import { gql } from '@apollo/client';

export const GET_MY_LEAVE_BALANCES = gql`
  query GetMyLeaveBalances($employeeId: String!) {
    getMyLeaveBalances(employeeId: $employeeId) {
      id
      employeeId
      leaveType
      totalAllowed
      used
      pending
      available
    }
  }
`;

export const GET_MY_LEAVE_REQUESTS = gql`
  query GetMyLeaveRequests($employeeId: String!) {
    getMyLeaveRequests(employeeId: $employeeId) {
      id
      employeeId
      employeeName
      leaveType
      startDate
      endDate
      totalDays
      reason
      status
      approvalComments
      approvedBy
      approvedByName
      approvedOn
      createdAt
    }
  }
`;

export const GET_PENDING_LEAVE_APPROVALS = gql`
  query GetPendingLeaveApprovals($managerId: String!) {
    getPendingLeaveApprovals(managerId: $managerId) {
      id
      employeeId
      employeeName
      leaveType
      startDate
      endDate
      totalDays
      reason
      status
      approvalComments
      approvedBy
      approvedByName
      approvedOn
      createdAt
    }
  }
`;

// Made with Bob