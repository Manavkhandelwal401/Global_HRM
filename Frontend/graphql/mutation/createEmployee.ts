import { gql } from '@apollo/client';

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee(
    $employeeId: String!
    $name: String!
    $email: String!
    $position: String!
    $department: String!
    $role: String!
    $activationCode: String!
    $managerId: String
  ) {
    createEmployee(
      employeeId: $employeeId
      name: $name
      email: $email
      position: $position
      department: $department
      role: $role
      activationCode: $activationCode
      managerId: $managerId
    ) {
      id
      fullName
      email
      position
      department
      managerId
      managerName
      status
    }
  }
`;
