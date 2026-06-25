using CopilotFeature.Domain;
using CopilotFeature.Domain.Repositories;

namespace CopilotFeature.Application.Services
{
    public interface ICopilotService
    {
        Task<CopilotResponse> AskHrCopilotAsync(string query, string employeeId);
    }

    public class CopilotService : ICopilotService
    {
        private readonly ICopilotRepository _copilotRepository;

        public CopilotService(ICopilotRepository copilotRepository)
        {
            _copilotRepository = copilotRepository;
        }

        public async Task<CopilotResponse> AskHrCopilotAsync(string query, string employeeId)
        {
            // Simulate AI response based on common HR queries
            var response = GenerateSimulatedResponse(query);
            
            // Store interaction for history
            var interaction = new CopilotInteraction
            {
                Id = Guid.NewGuid().ToString(),
                EmployeeId = employeeId,
                Query = query,
                Response = response.Response,
                InteractionTime = DateTime.UtcNow,
                WasHelpful = true,
                CreatedOn = DateTime.UtcNow
            };
            
            await _copilotRepository.CreateAsync(interaction);
            
            return response;
        }

        private CopilotResponse GenerateSimulatedResponse(string query)
        {
            var lowerQuery = query.ToLower();
            
            // Simulate responses for common HR queries
            if (lowerQuery.Contains("leave") || lowerQuery.Contains("lwp"))
            {
                return new CopilotResponse
                {
                    Query = query,
                    Response = "Leave Without Pay (LWP) policy: Employees can request unpaid leave after exhausting their paid leave balance. LWP requires manager approval and affects salary calculations. You can apply for LWP through the Leave Management module.",
                    SuggestedQuestions = new List<string>
                    {
                        "How many leaves do I have remaining?",
                        "What is the sick leave policy?",
                        "How do I apply for leave?"
                    },
                    Timestamp = DateTime.UtcNow
                };
            }
            else if (lowerQuery.Contains("benefit") || lowerQuery.Contains("insurance"))
            {
                return new CopilotResponse
                {
                    Query = query,
                    Response = "Our benefits package includes: Health Insurance (family coverage), Life Insurance, Retirement Plans (401k matching), Paid Time Off, and Professional Development allowances. You can view your specific benefits in the Employee Portal.",
                    SuggestedQuestions = new List<string>
                    {
                        "How do I enroll in health insurance?",
                        "What is the 401k matching policy?",
                        "When can I use my professional development budget?"
                    },
                    Timestamp = DateTime.UtcNow
                };
            }
            else if (lowerQuery.Contains("goal") || lowerQuery.Contains("performance"))
            {
                return new CopilotResponse
                {
                    Query = query,
                    Response = "Performance goals are set quarterly and reviewed during performance review cycles. You can track your goals in the Performance Management module. Goals should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound).",
                    SuggestedQuestions = new List<string>
                    {
                        "How do I set my quarterly goals?",
                        "When is the next performance review?",
                        "How are goals weighted?"
                    },
                    Timestamp = DateTime.UtcNow
                };
            }
            else if (lowerQuery.Contains("expense") || lowerQuery.Contains("reimbursement"))
            {
                return new CopilotResponse
                {
                    Query = query,
                    Response = "Expense reimbursements are processed within 7-10 business days after approval. Eligible expenses include travel, meals (with receipts), and approved business purchases. Submit expenses through the Expense Management module.",
                    SuggestedQuestions = new List<string>
                    {
                        "What expenses are reimbursable?",
                        "How do I submit an expense claim?",
                        "What is the meal allowance policy?"
                    },
                    Timestamp = DateTime.UtcNow
                };
            }
            else
            {
                return new CopilotResponse
                {
                    Query = query,
                    Response = "I'm here to help with HR-related questions! You can ask me about leave policies, benefits, performance goals, expense reimbursements, and more. Try asking a specific question about any HR topic.",
                    SuggestedQuestions = new List<string>
                    {
                        "What is the LWP policy?",
                        "How many leaves do I have?",
                        "What benefits are available?",
                        "How do I submit expenses?"
                    },
                    Timestamp = DateTime.UtcNow
                };
            }
        }
    }
}

// Made with Bob