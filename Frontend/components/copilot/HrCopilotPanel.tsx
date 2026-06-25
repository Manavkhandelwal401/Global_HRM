'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { ASK_HR_COPILOT } from '@/graphql/mutation/copilot';
import { useSession } from '@/context/SessionContext';
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';

export default function HrCopilotPanel() {
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'copilot'; text: string; timestamp: Date }>>([
    {
      sender: 'copilot',
      text: "Hello! I am your AI HR Copilot. Ask me anything about leaves, payroll, policies, or goals.",
      timestamp: new Date(),
    },
  ]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "What is the LWP policy?",
    "How many leaves do I have?",
    "When is the payroll processed?",
    "How can I submit my performance goals?"
  ]);

  const [askCopilot, { loading }] = useMutation<any, any>(ASK_HR_COPILOT);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const employeeId = user?.id || 'EMP001';

    // Add user message to chat history
    const userMsg = { sender: 'user' as const, text: textToSend, timestamp: new Date() };
    setChatHistory((prev) => [...prev, userMsg]);
    setQuery('');

    // Local semantic response analyzer
    const getMockResponse = (queryText: string): { reply: string; suggestions: string[] } => {
      const clean = queryText.toLowerCase().trim();

      // 1. Safety & Illegal Check
      const illegalKeywords = ['hack', 'illegal', 'steal', 'bypass', 'exploit', 'drug', 'weapon', 'fraud', 'cheat'];
      if (illegalKeywords.some(kw => clean.includes(kw))) {
        return {
          reply: "I cannot assist with queries involving security bypasses, illegal activities, or violations of company safety regulations. Please contact the security desk or legal team directly for such concerns.",
          suggestions: ["What is the LWP policy?", "When is the payroll processed?"]
        };
      }

      // 2. Personal Privacy Check (Restrict access to other employees' details)
      const personalKeywords = [
        'salary of', 'review of', 'sarah\'s', 'john\'s', 'private info', 'john doe\'s', 
        'performance of', 'other employee', 'colleague\'s data', 'contact details of'
      ];
      if (personalKeywords.some(kw => clean.includes(kw))) {
        return {
          reply: "To respect employee privacy and confidentiality, I cannot share individual payroll, performance ratings, or personal profiles. You can review your own information inside your dashboard panels.",
          suggestions: ["How many leaves do I have?", "How can I submit my performance goals?"]
        };
      }

      // 3. Out of Context Check
      const hrKeywords = [
        'leave', 'holiday', 'lwp', 'vacation', 'sick', 'time off',
        'pay', 'salary', 'allowance', 'bonus', 'payroll', 'reimburse', 'expense',
        'laptop', 'hardware', 'asset', 'device', 'keycard', 'credential', 'it support',
        'onboard', 'offboard', 'resign', 'clearance', 'exit',
        'goals', 'okr', 'performance', 'review',
        'policy', 'rule', 'guideline', 'handbook', 'announcement', 'office hours',
        'posh', 'complaint', 'harassment', 'abuse', 'grievance', 'report', 'icc'
      ];

      const isRelevant = hrKeywords.some(kw => clean.includes(kw)) || clean.split(' ').some(word => word.length > 3 && hrKeywords.some(kw => kw.includes(word)));

      if (!isRelevant) {
        return {
          reply: "I am your dedicated AI HR Copilot, specialized in company policies, leaves, payroll, onboarding/offboarding, and asset allocations. I cannot assist with out-of-context general queries or non-HR tasks.",
          suggestions: ["What is the LWP policy?", "How many leaves do I have?", "When is the payroll processed?"]
        };
      }

      // 4. Topic Matching
      if (clean.includes('posh') || clean.includes('complaint') || clean.includes('harassment') || clean.includes('grievance') || clean.includes('icc')) {
        return {
          reply: "WorkFlow maintains a strict, zero-tolerance POSH (Prevention of Sexual Harassment) policy. You can file a formal complaint directly to the Internal Complaints Committee (ICC) by emailing **icc.posh@workflowglobal.com**. All complaints are handled with absolute confidentiality and investigation starts within 48 hours.",
          suggestions: ["What is the LWP policy?", "How many leaves do I have?"]
        };
      }

      if (clean.includes('allowance') || clean.includes('reimburse') || clean.includes('expense')) {
        return {
          reply: "The company provides several standard allowances: \n- **Internet & Home Office**: Reimbursement up to $50/month for remote setups.\n- **Travel Allowance**: Mileage reimbursement at $0.67/mile for official client visits.\n- **Wellness Allowance**: Up to $30/month for gym memberships or health subscriptions.\nSubmit all claims via the 'Finance Support' request category with valid receipts attached.",
          suggestions: ["When is the payroll processed?", "What is the LWP policy?"]
        };
      }

      if (clean.includes('leave') || clean.includes('holiday') || clean.includes('vacation') || clean.includes('sick')) {
        if (clean.includes('lwp') || clean.includes('without pay')) {
          return {
            reply: "Leave Without Pay (LWP) can be requested when all accrued leaves are exhausted. It requires prior manager approval and HR review. During LWP, salary is prorated, and benefits continuation is subject to company policy details.",
            suggestions: ["How many leaves do I have?", "When is the payroll processed?"]
          };
        }
        return {
          reply: "Employees receive an annual allocation of 24 days of paid leaves, plus standard company holidays. To request time off, navigate to the 'Leave & Attendance' page, select your dates, and submit it for manager approval.",
          suggestions: ["What is the LWP policy?", "How many leaves do I have?"]
        };
      }

      if (clean.includes('pay') || clean.includes('salary') || clean.includes('payroll')) {
        return {
          reply: "Payroll is processed monthly on the 25th. If the 25th falls on a weekend or public holiday, it is credited on the preceding business day. You can view your historical slips under the Analytics dashboard.",
          suggestions: ["What is the LWP policy?", "How many leaves do I have?"]
        };
      }

      if (clean.includes('asset') || clean.includes('laptop') || clean.includes('hardware') || clean.includes('device') || clean.includes('keycard')) {
        return {
          reply: "Corporate assets (MacBooks, monitors, test phones, keycards) are managed by IT. You can view your allocated assets under the 'My Assets' tab. To request hardware upgrades or report damage, use the 'Request Return' or support ticket channels.",
          suggestions: ["How many leaves do I have?", "When is the payroll processed?"]
        };
      }

      if (clean.includes('goal') || clean.includes('okr') || clean.includes('performance') || clean.includes('review')) {
        return {
          reply: "You can submit your performance goals via the 'Performance' tab in your dashboard under 'My Goals & OKRs'. Fill in the title, metric targets, select the target period, and submit for manager review. Performance reviews occur bi-annually.",
          suggestions: ["How can I submit my performance goals?", "When is the payroll processed?"]
        };
      }

      if (clean.includes('onboard') || clean.includes('offboard') || clean.includes('resign') || clean.includes('clearance') || clean.includes('exit')) {
        return {
          reply: "For new hires, the 'Onboarding' tab contains your interactive checklist. For leaving employees, the 'Offboarding' tab manages resignation submissions and departmental clearance items (IT, Finance, HR, Admin).",
          suggestions: ["What is the LWP policy?", "How can I submit my performance goals?"]
        };
      }

      if (clean.includes('policy') || clean.includes('rule') || clean.includes('handbook') || clean.includes('announcement')) {
        return {
          reply: "All key company guidelines are published in the Employee Handbook. General updates (such as policy updates or training announcements) are pinned on the 'Announcements' tab of your dashboard.",
          suggestions: ["What is the LWP policy?", "When is the payroll processed?"]
        };
      }

      // Default HR reply
      return {
        reply: `I understand your query about "${queryText}". While I have identified this is related to HR/company topics, I don't have the exact policy clause mapped in my simulated data. I recommend submitting a formal inquiry under the 'Service Requests' tab so HR can assist you directly.`,
        suggestions: ["What is the LWP policy?", "How many leaves do I have?", "When is the payroll processed?"]
      };
    };

    try {
      const { data } = await askCopilot({
        variables: {
          query: textToSend,
          employeeId,
        },
      });

      if (data?.askHrCopilot) {
        const reply = data.askHrCopilot.response;
        const nextQuestions = data.askHrCopilot.suggestedQuestions || [];
        
        setChatHistory((prev) => [
          ...prev,
          { sender: 'copilot' as const, text: reply, timestamp: new Date() },
        ]);
        if (nextQuestions.length > 0) {
          setSuggestedQuestions(nextQuestions);
        }
        return;
      }
      throw new Error("No data returned from copilot service");
    } catch (err) {
      console.error("Copilot Query failed, using local mock fallback:", err);
      
      const { reply, suggestions } = getMockResponse(textToSend);

      setChatHistory((prev) => [
        ...prev,
        { sender: 'copilot' as const, text: reply, timestamp: new Date() },
      ]);
      setSuggestedQuestions(suggestions);
    }
  };

  return (
    <>
      {/* Floating Copilot Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 bg-teal-600 dark:bg-teal-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-200"
        title="Ask HR Copilot"
        id="copilot-trigger-btn"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Slide-Up Panel Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl flex flex-col h-[80vh] border-t border-gray-200 dark:border-gray-700 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="bg-teal-100 dark:bg-teal-900/50 p-2 rounded-lg text-teal-600 dark:text-teal-400">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-950 dark:text-white flex items-center gap-1.5">
                    HR Copilot
                    <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Simulated AI Assistant</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-soft ${
                      msg.sender === 'user'
                        ? 'bg-zinc-900 text-white rounded-br-none dark:bg-zinc-50 dark:text-zinc-900'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className="block text-[10px] mt-1 opacity-70 text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl rounded-bl-none px-4 py-3 text-sm shadow-soft flex items-center gap-2">
                    <span className="w-2 h-2 bg-zinc-600 dark:bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-zinc-600 dark:bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-zinc-600 dark:bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested Actions */}
            {suggestedQuestions.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Suggested Questions</p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pb-1">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-xs bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-left transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(query);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white p-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
