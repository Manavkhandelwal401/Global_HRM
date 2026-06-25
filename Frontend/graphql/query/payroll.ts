import { gql } from '@apollo/client';

export const GET_MY_PAYSLIPS = gql`
  query GetMyPayslips($employeeId: String!) {
    getMyPayslips(employeeId: $employeeId) {
      id
      employeeId
      employeeName
      payPeriodStart
      payPeriodEnd
      basicPay
      hra
      allowances
      grossPay
      pf
      incomeTax
      esi
      deductions
      netPay
      status
      createdAt
    }
  }
`;

export const GET_PAYROLL_DETAIL = gql`
  query GetPayrollDetail($payslipId: String!) {
    getPayrollDetail(payslipId: $payslipId) {
      id
      employeeId
      employeeName
      payPeriodStart
      payPeriodEnd
      basicPay
      hra
      allowances
      grossPay
      pf
      incomeTax
      esi
      deductions
      netPay
      status
      createdAt
    }
  }
`;

// Made with Bob