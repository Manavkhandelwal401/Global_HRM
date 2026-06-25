import { gql } from '@apollo/client';

// Queries
export const GET_MY_ALLOCATED_ASSETS = gql`
  query GetMyAllocatedAssets {
    getMyAllocatedAssets {
      id
      assetId
      employeeId
      allocatedOn
      returnedOn
      returnReason
      conditionOnReturn
      asset {
        id
        serialNumber
        assetName
        category
        condition
        status
      }
    }
  }
`;

export const GET_ALL_ASSETS = gql`
  query GetAllAssets($category: String, $status: String) {
    getAllAssets(category: $category, status: $status) {
      id
      serialNumber
      assetName
      category
      condition
      status
    }
  }
`;

export const GET_ALL_ALLOCATIONS = gql`
  query GetAllAllocations {
    getAllAllocations {
      id
      assetId
      employeeId
      allocatedOn
      returnedOn
      returnReason
      conditionOnReturn
      asset {
        id
        serialNumber
        assetName
        category
        condition
        status
      }
    }
  }
`;

// Mutations
export const CREATE_ASSET = gql`
  mutation CreateAsset($serialNumber: String!, $name: String!, $category: String!) {
    createAsset(serialNumber: $serialNumber, name: $name, category: $category) {
      id
      serialNumber
      assetName
      category
      condition
      status
    }
  }
`;

export const ALLOCATE_ASSET = gql`
  mutation AllocateAsset($assetId: String!, $employeeId: String!) {
    allocateAsset(assetId: $assetId, employeeId: $employeeId) {
      id
      assetId
      employeeId
      allocatedOn
      asset {
        id
        serialNumber
        assetName
        category
      }
    }
  }
`;

export const REQUEST_ASSET_RETURN = gql`
  mutation RequestAssetReturn($allocationId: String!, $reason: String!) {
    requestAssetReturn(allocationId: $allocationId, reason: $reason) {
      id
      returnReason
    }
  }
`;

export const PROCESS_ASSET_RETURN = gql`
  mutation ProcessAssetReturn($allocationId: String!, $conditionOnReturn: String!) {
    processAssetReturn(allocationId: $allocationId, conditionOnReturn: $conditionOnReturn) {
      id
      returnedOn
      conditionOnReturn
    }
  }
`;

// Made with Bob
