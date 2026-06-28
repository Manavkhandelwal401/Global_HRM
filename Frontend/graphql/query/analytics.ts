import { gql } from '@apollo/client';

export const GET_HR_METRICS = gql`
  query GetHRMetrics {
    getHRMetrics {
      attrition {
        riskPercentage
        trendDirection
        highRiskEmployees
      }
      diversity {
        byDepartment {
          department
          score
        }
        overallDiversityScore
      }
      training {
        completionPercentage
        totalCourses
        completedCourses
      }
      leave {
        patternsByMonth
        averageLeavePerEmployee
      }
    }
  }
`;

// Made with Bob
