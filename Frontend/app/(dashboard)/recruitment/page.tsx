'use client';

import React, { useState } from 'react';

interface JobPosting {
  id: string;
  title: string;
  department?: string;
  location?: string;
  experienceRequired?: string;
  salaryRange?: string;
  status: string;
  candidateCount: number;
}

interface Candidate {
  id: string;
  name: string;
  roleApplied?: string;
  status: string;
  rating: number;
  experience?: string;
  noticePeriod?: string;
  skills?: string;
  email?: string;
  phone?: string;
}

export default function RecruitmentPage() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      experienceRequired: '5+ years',
      salaryRange: '$120k - $150k',
      status: 'Open',
      candidateCount: 12
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      experienceRequired: '3-5 years',
      salaryRange: '$100k - $130k',
      status: 'Open',
      candidateCount: 8
    }
  ]);

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      roleApplied: 'Senior Full Stack Developer',
      status: 'Shortlisted',
      rating: 4.5,
      experience: '6 years',
      noticePeriod: '30 days',
      skills: 'React, Node.js, TypeScript, AWS',
      email: 'alice.j@email.com',
      phone: '+1-555-0101'
    },
    {
      id: '2',
      name: 'Bob Smith',
      roleApplied: 'Senior Full Stack Developer',
      status: 'Interviewing',
      rating: 4.0,
      experience: '5 years',
      noticePeriod: '60 days',
      skills: 'Vue.js, Python, Docker, PostgreSQL',
      email: 'bob.s@email.com',
      phone: '+1-555-0102'
    },
    {
      id: '3',
      name: 'Carol Williams',
      roleApplied: 'Senior Full Stack Developer',
      status: 'Applied',
      rating: 3.5,
      experience: '4 years',
      noticePeriod: '15 days',
      skills: 'Angular, Java, Spring Boot, MySQL',
      email: 'carol.w@email.com',
      phone: '+1-555-0103'
    }
  ]);

  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewer, setInterviewer] = useState("John Manager");
  const [interviewType, setInterviewType] = useState("Technical Round");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Shortlisted': return 'bg-blue-100 text-blue-800';
      case 'Interviewing': return 'bg-purple-100 text-purple-800';
      case 'Offered': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Applied': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleScheduleInterview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setInterviewDate("");
    setInterviewer("John Manager");
    setInterviewType("Technical Round");
    setShowInterviewModal(true);
  };

  const openProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowProfileModal(true);
  };

  const openJobDetails = (job: JobPosting) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const submitInterview = () => {
    if (!selectedCandidate || !interviewDate) return;
    setCandidates((prev) => prev.map((candidate) => candidate.id === selectedCandidate.id ? { ...candidate, status: 'Interviewing' } : candidate));
    setShowInterviewModal(false);
    setSelectedCandidate(null);
  };

  const handleStatusChange = (candidateId: string, status: string) => {
    setCandidates((prev) => prev.map((candidate) => candidate.id === candidateId ? { ...candidate, status } : candidate));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Recruitment Management</h1>

        {/* Job Postings Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Active Job Postings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobPostings.map((job) => (
              <div
                key={job.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => openJobDetails(job)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {job.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{job.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{job.salaryRange}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">
                    {job.candidateCount} candidate{job.candidateCount !== 1 ? 's' : ''}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Pipeline Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Candidate Pipeline</h2>
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.roleApplied}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{candidate.rating}</div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidate.status)}`}>
                      {candidate.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Experience:</span>
                    <p className="font-medium text-gray-900">{candidate.experience}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Notice Period:</span>
                    <p className="font-medium text-gray-900">{candidate.noticePeriod}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Skills:</span>
                    <p className="font-medium text-gray-900">{candidate.skills}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleScheduleInterview(candidate)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Schedule Interview
                  </button>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={candidate.status}
                    onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button
                    onClick={() => openProfile(candidate)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Interview Modal */}
        {showInterviewModal && selectedCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Schedule Interview</h3>
              <p className="text-gray-600 mb-4">Candidate: {selectedCandidate.name}</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interviewer
                  </label>
                  <select
                    value={interviewer}
                    onChange={(e) => setInterviewer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Select Interviewer</option>
                    <option>John Manager</option>
                    <option>Sarah Lead</option>
                    <option>Mike Director</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Type
                  </label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Technical Round</option>
                    <option>HR Round</option>
                    <option>Manager Round</option>
                    <option>Final Round</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={submitInterview}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Schedule
                </button>
                <button
                  onClick={() => setShowInterviewModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showProfileModal && selectedCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Candidate Profile</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-medium">Name:</span> {selectedCandidate.name}</p>
                <p><span className="font-medium">Role Applied:</span> {selectedCandidate.roleApplied}</p>
                <p><span className="font-medium">Email:</span> {selectedCandidate.email}</p>
                <p><span className="font-medium">Phone:</span> {selectedCandidate.phone}</p>
                <p><span className="font-medium">Experience:</span> {selectedCandidate.experience}</p>
                <p><span className="font-medium">Skills:</span> {selectedCandidate.skills}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showDetailsModal && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Job Details</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-medium">Title:</span> {selectedJob.title}</p>
                <p><span className="font-medium">Department:</span> {selectedJob.department}</p>
                <p><span className="font-medium">Location:</span> {selectedJob.location}</p>
                <p><span className="font-medium">Experience:</span> {selectedJob.experienceRequired}</p>
                <p><span className="font-medium">Salary:</span> {selectedJob.salaryRange}</p>
                <p><span className="font-medium">Status:</span> {selectedJob.status}</p>
                <p><span className="font-medium">Candidates:</span> {selectedJob.candidateCount}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Made with Bob