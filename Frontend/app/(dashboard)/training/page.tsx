'use client';

import React, { useState } from 'react';

interface TrainingModule {
  id: string;
  title: string;
  category: string;
  duration: number;
  mandatory: boolean;
  status: string;
  progressPercentage: number;
  description?: string;
  certificateIssued: boolean;
}

export default function TrainingPage() {
  const [modules] = useState<TrainingModule[]>([
    {
      id: '1',
      title: 'Data Privacy & GDPR Compliance',
      category: 'Compliance',
      duration: 120,
      mandatory: true,
      status: 'Completed',
      progressPercentage: 100,
      description: 'Learn about data protection regulations and best practices',
      certificateIssued: true
    },
    {
      id: '2',
      title: 'Advanced React Development',
      category: 'Technical',
      duration: 180,
      mandatory: false,
      status: 'InProgress',
      progressPercentage: 65,
      description: 'Master advanced React patterns and performance optimization',
      certificateIssued: false
    },
    {
      id: '3',
      title: 'Leadership & Communication Skills',
      category: 'SoftSkills',
      duration: 90,
      mandatory: false,
      status: 'NotStarted',
      progressPercentage: 0,
      description: 'Develop essential leadership and interpersonal skills',
      certificateIssued: false
    }
  ]);

  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<TrainingModule | null>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Compliance': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30';
      case 'Technical': return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/30';
      case 'SoftSkills': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30';
      case 'Leadership': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/30';
      default: return 'bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-950/30 dark:text-zinc-400 dark:border-zinc-900/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30';
      case 'InProgress': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30';
      case 'NotStarted': return 'bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-950/30 dark:text-zinc-400 dark:border-zinc-900/30';
      default: return 'bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-950/30 dark:text-zinc-400 dark:border-zinc-900/30';
    }
  };

  const handleDownloadCertificate = (module: TrainingModule) => {
    setActiveCertificate(module);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Training & Development
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Learn new skills, complete mandatory compliance courses, and view certificates
        </p>
      </div>

        {/* Training Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div key={module.id} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-4 gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(module.category)}`}>
                    {module.category}
                  </span>
                  {module.mandatory && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30">
                      Mandatory
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2 leading-snug">{module.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">{module.description}</p>
              </div>

              <div>
                <div className="mb-5">
                  <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1.5">
                    <span>Duration: {module.duration} mins</span>
                    <span>{module.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300 bg-primary"
                      style={{ width: `${module.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(module.status)}`}>
                    {module.status === 'NotStarted' ? 'Not Started' : 
                     module.status === 'InProgress' ? 'In Progress' : 'Completed'}
                  </span>

                  {module.certificateIssued ? (
                    <button
                      onClick={() => handleDownloadCertificate(module)}
                      className="px-3.5 py-2 bg-primary hover:opacity-90 text-white text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Certificate
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedModule(module)}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900 rounded-xl transition-all duration-200 text-xs font-semibold shadow-sm"
                    >
                      {module.status === 'NotStarted' ? 'Start' : 'Continue'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Module Detail Modal */}
        {selectedModule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedModule.title}</h2>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedModule.category)}`}>
                    {selectedModule.category}
                  </span>
                  {selectedModule.mandatory && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                      Mandatory
                    </span>
                  )}
                </div>

                <p className="text-gray-700 mb-4">{selectedModule.description}</p>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span className="font-medium">{selectedModule.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${selectedModule.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Course Content:</h3>
                  <div className="space-y-2">
                    {[
                      { title: 'Module 1: Introduction' },
                      { title: 'Module 2: Core Concepts' },
                      { title: 'Module 3: Advanced Topics' },
                      { title: 'Module 4: Final Assessment' },
                    ].map((mod, idx) => {
                      let status: 'completed' | 'current' | 'pending' = 'pending';
                      const pct = selectedModule.progressPercentage;
                      
                      if (pct === 100) {
                        status = 'completed';
                      } else if (pct === 0) {
                        status = idx === 0 ? 'current' : 'pending';
                      } else {
                        // For intermediate progress e.g. 65%
                        if (idx < 2) status = 'completed';
                        else if (idx === 2) status = 'current';
                        else status = 'pending';
                      }

                      if (status === 'completed') {
                        return (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-green-50/50 dark:bg-green-950/10 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                            <span className="text-zinc-700 dark:text-zinc-300 text-sm">{mod.title}</span>
                          </div>
                        );
                      } else if (status === 'current') {
                        return (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">→</div>
                            <span className="text-zinc-900 dark:text-zinc-100 font-semibold text-sm">{mod.title} (Current)</span>
                          </div>
                        );
                      } else {
                        return (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-lg opacity-50">
                            <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 text-xs">○</div>
                            <span className="text-zinc-500 dark:text-zinc-400 text-sm">{mod.title}</span>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    console.log('Continuing module:', selectedModule.id);
                    setSelectedModule(null);
                  }}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-md hover:opacity-90 transition-colors font-medium"
                >
                  Continue Learning
                </button>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Viewer Modal */}
        {activeCertificate && (
          <div id="print-certificate-modal" className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-2xl w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl relative print-certificate-card">
              {/* Gold/Zinc double border inside the card to look like a true certificate frame */}
              <div className="border-4 border-double border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center relative overflow-hidden">
                
                {/* Background Certificate Watermark Seal */}
                <div className="absolute right-4 top-4 opacity-15">
                  <svg className="w-24 h-24 text-zinc-900 dark:text-zinc-100" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a.75.75 0 00-.708-.523H4.5a2.5 2.5 0 00-2.5 2.5v1.076a.75.75 0 00.522.708l3.18 1.06a.75.75 0 01.523.708v1.076a2.5 2.5 0 002.5 2.5h1.076a.75.75 0 00.708-.522l1.06-3.18a.75.75 0 01.708-.523h1.076a2.5 2.5 0 002.5-2.5V5.432a.75.75 0 00-.522-.708l-3.18-1.06a.75.75 0 01-.523-.708V1.88a2.5 2.5 0 00-2.5-2.5H8.38a.75.75 0 00-.708.522L6.612 3.08a.75.75 0 01-.708.523z" clipRule="evenodd" />
                  </svg>
                </div>

                <h4 className="text-xs font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                  WorkFlow Global HRMS
                </h4>
                <h2 className="text-2xl font-serif font-bold text-zinc-950 dark:text-zinc-50 mb-6">
                  Certificate of Completion
                </h2>
                
                <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400 mb-2">
                  This is proudly presented to
                </p>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 underline decoration-zinc-300 dark:decoration-zinc-700 decoration-2 underline-offset-8 mb-6">
                  John Doe
                </h3>
                
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed mb-6">
                  for successfully completing the mandatory training curriculum and satisfying all compliance assessments for the module:
                </p>
                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 py-3 px-6 rounded-lg inline-block mb-8">
                  <span className="text-base font-bold text-zinc-800 dark:text-zinc-100">
                    {activeCertificate.title}
                  </span>
                </div>

                <div className="flex justify-between items-end border-t border-zinc-100 dark:border-zinc-800/80 pt-6">
                  <div className="text-left">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Date Issued</p>
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
                      {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  
                  {/* Golden seal icon in the center */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60 shadow-sm">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Authorized Signature</p>
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 font-serif italic mt-0.5">
                      Sarah Jenkins, HR Director
                    </p>
                  </div>
                </div>

              </div>

              <div className="flex gap-3 mt-6 print-exclude">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900 rounded-xl transition-colors text-xs font-semibold"
                >
                  Print Certificate
                </button>
                <button
                  onClick={() => setActiveCertificate(null)}
                  className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-zinc-300 rounded-xl transition-colors text-xs font-semibold"
                >
                  Close Preview
                </button>
              </div>

            </div>
          </div>
        )}
    </div>
  );
}

// Made with Bob