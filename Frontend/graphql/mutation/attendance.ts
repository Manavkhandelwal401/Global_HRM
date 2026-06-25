import { gql } from '@apollo/client';

export const CLOCK_IN = gql`
  mutation ClockIn($employeeId: String!) {
    clockIn(employeeId: $employeeId) {
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

export const CLOCK_OUT = gql`
  mutation ClockOut($employeeId: String!) {
    clockOut(employeeId: $employeeId) {
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
