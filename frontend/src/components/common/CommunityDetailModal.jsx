import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Modal from './Modal';
import Badge from './Badge';
import LoadingSpinner from './LoadingSpinner';
import { Users, UserCheck, Shield, Calendar, Award } from 'lucide-react';

const CommunityDetailModal = ({ isOpen, onClose, community }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && community?.id) {
      fetchMembers();
    }
  }, [isOpen, community]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/memberships/community/${community.id}`);
      setMembers(res.data);
    } catch (err) {
      console.error('Error fetching community members:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!community) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={community.name}>
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Header Info */}
        <div className="glass-panel p-4 rounded-xl border border-warmgold-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-chestnut-700/30 text-warmgold-400 border border-warmgold-500/20">
              {community.category}
            </span>
            <Badge status={community.status}>{community.status}</Badge>
          </div>
          <p className="text-xs text-stardustsilver-300/80 leading-relaxed">{community.description}</p>
        </div>

        {/* Staff & Leadership Roster */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-bold text-warmgold-400 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Community Leadership & Staff
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Faculty Lead */}
            <div className="glass-card p-3.5 rounded-xl border border-stardustsilver-300/15 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-warmgold-500/20 flex items-center justify-center text-warmgold-400 font-bold text-xs">
                👨‍🏫
              </div>
              <div className="overflow-hidden">
                <div className="text-[10px] text-stardustsilver-300/60 uppercase tracking-widest font-semibold">Faculty Coordinator / Staff</div>
                <div className="text-xs font-bold text-white truncate">{community.facultyCoordinator || 'Unassigned Staff'}</div>
              </div>
            </div>

            {/* Student Coordinator */}
            <div className="glass-card p-3.5 rounded-xl border border-stardustsilver-300/15 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-morning-500/20 flex items-center justify-center text-morning-300 font-bold text-xs">
                🎓
              </div>
              <div className="overflow-hidden">
                <div className="text-[10px] text-stardustsilver-300/60 uppercase tracking-widest font-semibold">Student Coordinator / Head</div>
                <div className="text-xs font-bold text-white truncate">{community.studentCoordinator || 'Unassigned Lead'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Members Roster */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-morning-300" /> Enrolled Members Roster
            </h4>
            <span className="text-xs font-mono text-warmgold-400 font-bold">
              {members.length} Registered {members.length === 1 ? 'Member' : 'Members'}
            </span>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading member roster..." />
          ) : members.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-arsenic-900/80 border border-stardustsilver-300/15 flex items-center justify-between gap-3 text-xs hover:border-warmgold-500/30 transition"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-chestnut-700/40 border border-chestnut-500/30 flex items-center justify-center text-warmgold-300 font-bold text-xs shrink-0">
                      {m.studentName ? m.studentName[0] : 'S'}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-white truncate">{m.studentName}</div>
                      <div className="text-[10px] text-stardustsilver-300/60 truncate">
                        {m.department} • Reg #{m.studentCode}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-arsenic-800 text-warmgold-300 border border-warmgold-500/20">
                      {m.role || 'MEMBER'}
                    </span>
                    <Badge status={m.status}>{m.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-stardustsilver-300/50 glass-card rounded-xl">
              No enrolled student members found for this community yet.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CommunityDetailModal;
