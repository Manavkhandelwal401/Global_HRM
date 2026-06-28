namespace CopilotFeature.Domain
{
    public class CopilotResponse
    {
        public string Query { get; set; } = string.Empty;
        public string Response { get; set; } = string.Empty;
        public List<string> SuggestedQuestions { get; set; } = new();
        public DateTime Timestamp { get; set; }
    }
}

// Made with Bob