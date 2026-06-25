'use client';

import React, { useState, useEffect } from 'react';

import { useSession } from '@/context/SessionContext';
import { useToast } from '@/context/ToastContext';

interface Announcement {
  id: string;
  title: string;
  category: string;
  content: string;
  priority: string;
  visibilityScope: string;
  createdBy: string;
  createdByName: string;
  expiryDate?: string;
  isAcknowledged: boolean;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const { user } = useSession();
  const { showToast } = useToast();
  const currentRole = user?.role || 'Employee';
  const isAdminOrHR = currentRole === 'Admin' || currentRole === 'HR' || currentRole === 'Manager';

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [mounted, setMounted] = useState(false);

  // User-specific persistence keys
  const deletedKey = `announcements-deleted-${user?.id || 'guest'}`;
  const acknowledgedKey = `announcements-acknowledged-${user?.id || 'guest'}`;

  useEffect(() => {
    const saved = localStorage.getItem("company-announcements");
    // Deleted IDs for this user
    const deletedIds: string[] = JSON.parse(localStorage.getItem(deletedKey) || '[]');
    // Acknowledged IDs for this user
    const acknowledgedIds: string[] = JSON.parse(localStorage.getItem(acknowledgedKey) || '[]');

    let base: Announcement[];
    if (saved) {
      base = JSON.parse(saved);
    } else {
      const defaultAnnouncements: Announcement[] = [
        {
          id: '1',
          title: 'Updated Data Privacy Policy',
          category: 'Policy',
          content: 'We have updated our data privacy policy to comply with new regulations. All employees must review and acknowledge this policy by end of month.',
          priority: 'High',
          visibilityScope: 'Global',
          createdBy: 'hr-admin',
          createdByName: 'HR Department',
          expiryDate: '2026-12-31',
          isAcknowledged: false,
          createdAt: '2026-06-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'Holiday Schedule 2026',
          category: 'General',
          content: 'The company holiday schedule for 2026 has been published. Please check the calendar and plan your time off accordingly.',
          priority: 'Medium',
          visibilityScope: 'Global',
          createdBy: 'hr-admin',
          createdByName: 'HR Department',
          expiryDate: '2026-12-31',
          isAcknowledged: false,
          createdAt: '2026-06-10T09:00:00Z'
        },
        {
          id: '3',
          title: 'New Office Opening - Austin',
          category: 'CompanyNews',
          content: 'We are excited to announce the opening of our new office in Austin, Texas! The office will be operational from November 1st.',
          priority: 'Medium',
          visibilityScope: 'Global',
          createdBy: 'ceo',
          createdByName: 'CEO Office',
          isAcknowledged: false,
          createdAt: '2026-06-05T14:00:00Z'
        },
        {
          id: '4',
          title: 'Mandatory Security Training',
          category: 'Training',
          content: 'All employees must complete the cybersecurity awareness training by October 31st. This is a compliance requirement.',
          priority: 'High',
          visibilityScope: 'Global',
          createdBy: 'it-admin',
          createdByName: 'IT Security',
          expiryDate: '2026-10-31',
          isAcknowledged: false,
          createdAt: '2026-06-01T08:00:00Z'
        }
      ];
      base = defaultAnnouncements;
      localStorage.setItem("company-announcements", JSON.stringify(defaultAnnouncements));
    }

    // Apply user-specific deletions and acknowledgements
    const merged = base
      .filter(a => !deletedIds.includes(a.id))
      .map(a => ({ ...a, isAcknowledged: a.isAcknowledged || acknowledgedIds.includes(a.id) }));

    setAnnouncements(merged);
    setMounted(true);
  }, [deletedKey, acknowledgedKey]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newPriority, setNewPriority] = useState('Low');
  const [newVisibility, setNewVisibility] = useState('Global');
  const [newContent, setNewContent] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Policy': return 'bg-purple-100 text-purple-800';
      case 'CompanyNews': return 'bg-blue-100 text-blue-800';
      case 'Training': return 'bg-orange-100 text-orange-800';
      case 'General': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);

  const handleAcknowledge = (announcement: Announcement) => {
    // Persist acknowledged ID in user-specific key
    const existing: string[] = JSON.parse(localStorage.getItem(acknowledgedKey) || '[]');
    if (!existing.includes(announcement.id)) {
      localStorage.setItem(acknowledgedKey, JSON.stringify([...existing, announcement.id]));
    }
    setAnnouncements(prev => {
      const next = prev.map(a => a.id === announcement.id ? { ...a, isAcknowledged: true } : a);
      localStorage.setItem("company-announcements", JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteClick = (id: string) => {
    setAnnouncementToDelete(id);
  };

  const confirmDelete = () => {
    if (announcementToDelete) {
      // Persist deleted ID in user-specific key so it stays gone after refresh/re-login
      const existing: string[] = JSON.parse(localStorage.getItem(deletedKey) || '[]');
      if (!existing.includes(announcementToDelete)) {
        localStorage.setItem(deletedKey, JSON.stringify([...existing, announcementToDelete]));
      }
      setAnnouncements(prev => {
        const next = prev.filter(a => a.id !== announcementToDelete);
        localStorage.setItem("company-announcements", JSON.stringify(next));
        return next;
      });
      setAnnouncementToDelete(null);
    }
  };

  const handleCreateAnnouncement = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      showToast("Please fill in the title and content fields.", "error");
      return;
    }

    const created: Announcement = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      content: newContent,
      priority: newPriority,
      visibilityScope: newVisibility,
      createdBy: user?.id || 'admin',
      createdByName: user?.name || 'Administrator',
      expiryDate: newExpiryDate || undefined,
      isAcknowledged: false,
      createdAt: new Date().toISOString()
    };

    setAnnouncements(prev => {
      const next = [created, ...prev];
      localStorage.setItem("company-announcements", JSON.stringify(next));
      return next;
    });
    
    // Reset Form
    setNewTitle('');
    setNewCategory('General');
    setNewPriority('Low');
    setNewVisibility('Global');
    setNewContent('');
    setNewExpiryDate('');
    setShowCreateModal(false);
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (!mounted) {
    return (
      <div className="space-y-6 pb-20 animate-pulse">
        <div className="max-w-5xl">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-2">
              <div className="h-7 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-72 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
            <div className="h-9 w-32 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
          </div>
          <div className="grid gap-4">
            <div className="h-28 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
            <div className="h-28 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
            <div className="h-28 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              Company Announcements {isAdminOrHR && <span className="text-xs px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full font-bold">Admin View</span>}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Important notices and updates across the organization</p>
          </div>
          {isAdminOrHR && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900 rounded-xl transition-all duration-200 text-xs font-semibold shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Announcement
            </button>
          )}
        </div>

        {/* Announcements List */}
        <div className="grid gap-4">
          {sortedAnnouncements.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4 shadow-sm min-h-[300px]">
              <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-base">No Announcements</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-sm">
                  You're all caught up! Important notices and updates across the organization will show up here.
                </p>
              </div>
            </div>
          ) : (
            sortedAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className={`bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm border-l-4 ${
                  announcement.priority === 'High' ? 'border-l-rose-500' :
                  announcement.priority === 'Medium' ? 'border-l-amber-500' :
                  'border-l-emerald-500'
                } transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{announcement.title}</h2>
                      {announcement.isAcknowledged && (
                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Acknowledged
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border uppercase tracking-wider ${
                        announcement.priority === 'High' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50' :
                        announcement.priority === 'Medium' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50' :
                        'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50'
                      }`}>
                        {announcement.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {announcement.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {announcement.createdByName}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {announcement.createdAt.split('T')[0]}
                      </span>
                    </div>
                  </div>
                  {isAdminOrHR && (
                    <button
                      onClick={() => handleDeleteClick(announcement.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="Delete Announcement"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <p className="text-zinc-600 dark:text-zinc-300 text-sm mb-3.5 leading-relaxed">{announcement.content}</p>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                  {announcement.expiryDate ? (
                    <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Expires: {announcement.expiryDate}</span>
                    </div>
                  ) : <div />}

                  <div className="flex gap-2">
                    {!announcement.isAcknowledged && (announcement.category === 'Policy' || announcement.category === 'Training') && (
                      <button
                        onClick={() => handleAcknowledge(announcement)}
                        className="px-3.5 py-1.5 bg-zinc-900 dark:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 rounded-lg text-xs font-semibold transition-all duration-200"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedAnnouncement(announcement)}
                      className="px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-855 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-semibold transition-all duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Announcement Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-950 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200 dark:border-zinc-800 shadow-xl">
              <h3 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-zinc-50">Create New Announcement</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter announcement title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Category</label>
                    <select 
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="General">General</option>
                      <option value="Policy">Policy</option>
                      <option value="CompanyNews">CompanyNews</option>
                      <option value="Training">Training</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Priority</label>
                    <select 
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Visibility Scope</label>
                  <select 
                    value={newVisibility}
                    onChange={e => setNewVisibility(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Global">Global</option>
                    <option value="Department">Department</option>
                    <option value="Location">Location</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Content</label>
                  <textarea
                    rows={6}
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter announcement content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={newExpiryDate}
                    onChange={e => setNewExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateAnnouncement}
                  className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors font-medium"
                >
                  Publish Announcement
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {selectedAnnouncement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedAnnouncement.title}</h2>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedAnnouncement.priority)}`}>
                    {selectedAnnouncement.priority} Priority
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedAnnouncement.category)}`}>
                    {selectedAnnouncement.category}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedAnnouncement.content}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Posted by:</span>
                    <p className="font-medium text-gray-900">{selectedAnnouncement.createdByName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Posted on:</span>
                    <p className="font-medium text-gray-900">
                      {selectedAnnouncement.createdAt.split('T')[0]}
                    </p>
                  </div>
                  {selectedAnnouncement.expiryDate && (
                    <div>
                      <span className="text-gray-500">Expires on:</span>
                      <p className="font-medium text-gray-900">
                        {selectedAnnouncement.expiryDate}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Visibility:</span>
                    <p className="font-medium text-gray-900">{selectedAnnouncement.visibilityScope}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {!selectedAnnouncement.isAcknowledged && (selectedAnnouncement.category === 'Policy' || selectedAnnouncement.category === 'Training') && (
                  <button
                    onClick={() => {
                      handleAcknowledge(selectedAnnouncement);
                      setSelectedAnnouncement(null);
                    }}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Acknowledge
                  </button>
                )}
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        {announcementToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6 transform scale-100 transition-all">
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Confirm Deletion</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Are you sure you want to delete this announcement? This action is permanent and cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setAnnouncementToDelete(null)}
                  className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-sm font-semibold transition-colors"
                >
                  No, cancel
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