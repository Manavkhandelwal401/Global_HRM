'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_RECOGNITION_FEED, GET_MY_RECOGNITION_POINTS } from '@/graphql/query/recognition';
import { NOMINATE_PEER } from '@/graphql/mutation/recognition';
import { useSession } from '@/context/SessionContext';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { Award, Gift, Sparkles, Send, ShieldAlert } from 'lucide-react';

const CORE_VALUES = [
  { name: 'Integrity', desc: 'Doing the right thing, always.' },
  { name: 'CustomerFirst', desc: 'Exceeding client expectations.' },
  { name: 'Innovation', desc: 'Thinking outside the box.' },
  { name: 'Collaboration', desc: 'Winning together as one team.' },
  { name: 'Excellence', desc: 'Delivering outstanding quality.' }
];

export default function ContributionsPage() {
  const { user } = useSession();
  const [showNominationForm, setShowNominationForm] = useState(false);
  const [nomineeId, setNomineeId] = useState('');
  const [coreValue, setCoreValue] = useState('Integrity');
  const [reason, setReason] = useState('');
  const [points, setPoints] = useState(50);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { data: feedData, loading: feedLoading, error: feedError, refetch: refetchFeed } = useQuery<any, any>(GET_RECOGNITION_FEED);
  const { data: pointsData, refetch: refetchPoints } = useQuery<any, any>(GET_MY_RECOGNITION_POINTS, {
    variables: { employeeId: user?.id || '' },
    skip: !user?.id
  });

  const [nominatePeer, { loading: nominating }] = useMutation<any, any>(NOMINATE_PEER, {
    onCompleted: () => {
      setSuccessMsg('Nomination submitted successfully!');
      setNomineeId('');
      setReason('');
      setPoints(50);
      refetchFeed();
      refetchPoints();
      setTimeout(() => setSuccessMsg(''), 4000);
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to submit nomination.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  });

  React.useEffect(() => {
    if (feedError) {
      console.warn("Contributions Feed Query Error:", feedError);
    }
  }, [feedError]);

  const defaultRecognitions = [
    {
      id: '1',
      senderName: 'Sarah Jenkins',
      nomineeName: 'John Doe',
      coreValue: 'Collaboration',
      reason: 'Excellent work supporting the modular monolithic architecture migration!',
      points: 100,
      timestamp: new Date().toISOString()
    }
  ];

  const recognitions = feedData?.getRecognitionFeed || defaultRecognitions;
  const myPoints = pointsData?.getMyRecognitionPoints !== undefined ? pointsData.getMyRecognitionPoints : 350;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomineeId || !reason.trim() || !user?.id) {
      alert('Please fill out all fields.');
      return;
    }
    
    if (nomineeId === user.id) {
      alert('You cannot nominate yourself!');
      return;
    }

    await nominatePeer({
      variables: {
        nomineeId,
        coreValue,
        reason,
        points: Number(points)
      }
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Award className="h-6 w-6 text-yellow-500" />
          Contributions & Recognition
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Celebrate successes and appreciate your peers for upholding core values.
        </p>
      </div>

      {/* Points Summary Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider opacity-85">My Reward Balance</span>
          <h2 className="text-4xl font-extrabold mt-1 flex items-baseline gap-1">
            {myPoints} <span className="text-sm font-normal">pts</span>
          </h2>
          <p className="text-xs mt-2 opacity-90 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-yellow-300 animate-spin" />
            Redeemable for gift cards & perks
          </p>
        </div>
        <div className="bg-white/10 p-3 rounded-full">
          <Gift className="h-10 w-10 text-white" />
        </div>
      </div>

      {/* Nominate Peer Trigger */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowNominationForm(!showNominationForm)}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Send className="h-4 w-4" />
          {showNominationForm ? 'Close Form' : 'Nominate a Peer'}
        </button>
      </div>

      {/* Nomination Form */}
      {showNominationForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">New Peer Nomination</h3>
          
          {errorMsg && <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-center gap-1.5"><ShieldAlert className="h-4 w-4" /> {errorMsg}</div>}
          {successMsg && <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-xs rounded-lg">{successMsg}</div>}

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Nominee Employee ID</label>
            <input
              type="text"
              value={nomineeId}
              onChange={(e) => setNomineeId(e.target.value)}
              placeholder="e.g. emp-102"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Core Value Alignment</label>
            <div className="grid grid-cols-2 gap-2">
              {CORE_VALUES.map((val) => (
                <button
                  key={val.name}
                  type="button"
                  onClick={() => setCoreValue(val.name)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    coreValue === val.name
                      ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20 text-teal-800 dark:text-teal-400 font-medium'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <p className="text-xs font-bold">{val.name}</p>
                  <p className="text-[10px] opacity-75 mt-0.5 line-clamp-1">{val.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Points Reward (20 - 100)</label>
            <input
              type="range"
              min="20"
              max="100"
              step="10"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1.5 font-mono">
              <span>20 pts</span>
              <span className="font-bold text-teal-600 dark:text-teal-400">{points} pts selected</span>
              <span>100 pts</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Reason for Recognition</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Describe how they demonstrated this core value..."
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-teal-500"
              maxLength={200}
              required
            />
            <span className="text-[10px] text-gray-400 float-right mt-1">{reason.length}/200</span>
          </div>

          <button
            type="submit"
            disabled={nominating || !nomineeId}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {nominating ? 'Submitting Nomination...' : 'Send Recognition'}
          </button>
        </form>
      )}

      {/* Recognition Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
          Public Feed
        </h3>
        
        {recognitions.length === 0 ? (
          <EmptyState title="No recognitions yet" description="Be the first to appreciate a team member!" />
        ) : (
          <div className="space-y-3">
            {recognitions.map((rec: any) => (
              <div key={rec.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm flex gap-3 animate-fade-in">
                <div className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1 text-xs">
                    <span className="font-bold text-gray-900 dark:text-white">{rec.nominatorName}</span>
                    <span className="text-gray-500">recognized</span>
                    <span className="font-bold text-gray-900 dark:text-white">{rec.nomineeName}</span>
                  </div>
                  <div className="inline-block bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {rec.coreValue}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-lg italic">
                    "{rec.reason}"
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono pt-1">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">+{rec.points} Points Awarded</span>
                    <span>{new Date(rec.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
