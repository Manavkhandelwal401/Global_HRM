import { gql } from '@apollo/client';

export const SUBMIT_LEAVE_REQUEST = gql`
  mutation SubmitLeaveRequest($request: SubmitLeaveRequestInput!) {
    submitLeaveRequest(request: $request) {
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

export const APPROVE_LEAVE_REQUEST = gql`
  mutation ApproveLeaveRequest($request: ApproveLeaveRequestInput!) {
    approveLeaveRequest(request: $request) {
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

export const REJECT_LEAVE_REQUEST = gql`
  mutation RejectLeaveRequest($request: RejectLeaveRequestInput!) {
    rejectLeaveRequest(request: $request) {
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

export const CANCEL_LEAVE_REQUEST = gql`
  mutation CancelLeaveRequest($requestId: String!, $employeeId: String!) {
    cancelLeaveRequest(requestId: $requestId, employeeId: $employeeId) {
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