import { gql } from '@apollo/client';

export const GET_TEAM_DIRECTORY = gql`
  query GetTeamDirectory($search: String, $statusFilter: String) {
    getTeamDirectory(search: $search, statusFilter: $statusFilter) {
      id
      fullName
      email
      position
      department
      managerId
      managerName
      status
      profilePictureUrl
    }
  }
`;

export const GET_ORG_CHART = gql`
  query GetOrgChart($rootEmployeeId: String!) {
    getOrgChart(rootEmployeeId: $rootEmployeeId) {
      employeeId
      employeeName
      position
      department
      managerId
      directReports {
        employeeId
        employeeName
        position
        department
        managerId
      }
    }
  }
`;

// Made with Bob
