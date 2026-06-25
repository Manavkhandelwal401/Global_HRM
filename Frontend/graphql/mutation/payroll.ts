import { gql } from '@apollo/client';

export const DOWNLOAD_PAYSLIP = gql`
  mutation DownloadPayslip($payslipId: String!) {
    downloadPayslip(payslipId: $payslipId) {
      downloadUrl
      success
      message
    }
  }
`;
