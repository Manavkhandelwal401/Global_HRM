import { gql } from '@apollo/client';

// Queries
export const GET_MY_SERVICE_REQUESTS = gql`
  query GetMyServiceRequests {
    getMyServiceRequests {
      id
      employeeId
      title
      description
      category
      priority
      status
      assignedToId
      assignedToName
      resolutionComments
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_SERVICE_REQUESTS = gql`
  query GetAllServiceRequests($category: String, $status: String, $priority: String) {
    getAllServiceRequests(category: $category, status: $status, priority: $priority) {
      id
      employeeId
      title
      description
      category
      priority
      status
      assignedToId
      assignedToName
      resolutionComments
      createdAt
      updatedAt
    }
  }
`;

export const GET_SERVICE_REQUEST_DETAILS = gql`
  query GetServiceRequestDetails($requestId: String!) {
    getServiceRequestDetails(requestId: $requestId) {
      id
      employeeId
      title
      description
      category
      priority
      status
      assignedToId
      assignedToName
      resolutionComments
      createdAt
      updatedAt
    }
  }
`;

// Mutations
export const CREATE_SERVICE_REQUEST = gql`
  mutation CreateServiceRequest($title: String!, $description: String!, $category: String!, $priority: String!) {
    createServiceRequest(title: $title, description: $description, category: $category, priority: $priority) {
      id
      employeeId
      title
      description
      category
      priority
      status
      createdAt
    }
  }
`;

export const ASSIGN_SERVICE_REQUEST = gql`
  mutation AssignServiceRequest($requestId: String!, $assignedToId: String!, $assignedToName: String!) {
    assignServiceRequest(requestId: $requestId, assignedToId: $assignedToId, assignedToName: $assignedToName) {
      id
      assignedToId
      assignedToName
      status
      updatedAt
    }
  }
`;

export const RESOLVE_SERVICE_REQUEST = gql`
  mutation ResolveServiceRequest($requestId: String!, $resolutionComments: String!) {
    resolveServiceRequest(requestId: $requestId, resolutionComments: $resolutionComments) {
      id
      status
      resolutionComments
      updatedAt
    }
  }
`;

// Made with Bob