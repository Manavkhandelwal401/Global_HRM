import { gql } from '@apollo/client';

export const GET_TODAY_ATTENDANCE = gql`
  query GetTodayAttendance($employeeId: String!) {
    getTodayAttendance(employeeId: $employeeId) {
      id
      employeeId
      employeeName
      date
      clockIn
      clockOut
      productiveHours
      breakHours
      overtimeHours
      status
    }
  }
`;

export const GET_MY_ATTENDANCE = gql`
  query GetMyAttendance($employeeId: String!, $startDate: DateTime!, $endDate: DateTime!) {
    getMyAttendance(employeeId: $employeeId, startDate: $startDate, endDate: $endDate) {
      id
      employeeId
      employeeName
      date
      clockIn
      clockOut
      productiveHours
      breakHours
      overtimeHours
      status
    }
  }
`;

export const GET_TEAM_ATTENDANCE = gql`
  query GetTeamAttendance($managerId: String!, $date: DateTime!, $statusFilter: AttendanceStatus) {
    getTeamAttendance(managerId: $managerId, date: $date, statusFilter: $statusFilter) {
      id
      employeeId
      employeeName
      date
      clockIn
      clockOut
      productiveHours
      breakHours
      overtimeHours
      status
    }
  }
`;

// Made with Bob
