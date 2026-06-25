import { gql } from '@apollo/client';

export const UPLOAD_DOCUMENT = gql`
  mutation UploadDocument(
    $employeeId: String!
    $category: DocumentCategory!
    $name: String!
    $url: String!
    $expiryDate: DateTime
  ) {
    uploadDocument(
      employeeId: $employeeId
      category: $category
      name: $name
      url: $url
      expiryDate: $expiryDate
    ) {
      id
      employeeId
      category
      name
      url
      expiryDate
      status
      createdAt
    }
  }
`;

export const VERIFY_DOCUMENT = gql`
  mutation VerifyDocument($documentId: String!) {
    verifyDocument(documentId: $documentId) {
      id
      status
      updatedAt
    }
  }
`;

export const REJECT_DOCUMENT = gql`
  mutation RejectDocument($documentId: String!, $reason: String!) {
    rejectDocument(documentId: $documentId, reason: $reason) {
      id
      status
      rejectionReason
      updatedAt
    }
  }
`;

// Made with Bob