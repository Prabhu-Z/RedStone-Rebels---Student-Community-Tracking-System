import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { Users, Crown, GraduationCap, Calendar, CheckCircle2, UserPlus, LogOut, Info, ShieldCheck, Sparkles, ChevronRight, Building2 } from 'lucide-react';

const GroupOpeningsPage = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [myCommunities, setMyCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState('');
  const [groups, setGroups] = useState([]);
  const [myJoinedGroup, setMyJoinedGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inspector Modal State
  const [inspectModal, setInspectModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const studentRes = await api.get(`/students/user/${user.id}`).catch(() => null);
      const studentData = studentRes?.data || null;
      setStudent(studentData);

      if (studentData?.id) {
        // Fetch student's joined communities
        const memRes = await api.get(`/memberships/student/${studentData.id}`);
        const activeMems = (memRes.data || []).filter(m => m.status === 'APPROVED');
        setMyCommunities(activeMems);

        if (activeMems.length === 0) {
          setGroups([]);
          setMyJoinedGroup(null);
          setLoading(false);
          return;
        }

        let targetCommId = activeMems[0].communityId.toString();
        setSelectedCommunityId(targetCommId);

        // Fetch student's joined group (if any)
        const myJoinedRes = await api.get(`/community-groups/student/${studentData.id}`);
        const joinedList = myJoinedRes.data || [];
        if (joinedList.length > 0) {
          setMyJoinedGroup(joinedList[0]);
        } else {
          setMyJoinedGroup(null);
        }

        // Fetch groups strictly for student's joined community
        fetchGroupsForCommunity(targetCommId, studentData.id);
      }
    } catch (err) {
      console.error('Error fetching group openings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupsForCommunity = async (commId, studentId) => {
    try {
      const res = await api.get(`/community-groups/community/${commId}/approved`);
      setGroups(res.data || []);

      // Check if student joined any group in this community
      if (studentId) {
        const myJoined = (res.data || []).find(g =>
          g.members && g.members.some(m => m.studentId === studentId)
        );
        if (myJoined) {
          setMyJoinedGroup(myJoined);
        }
      }
    } catch (err) {
      console.error('Error fetching groups for community:', err);
    }
  };

  const handleCommunityChange = (commId) => {
    setSelectedCommunityId(commId);
    if (student?.id) {
      fetchGroupsForCommunity(commId, student.id);
    }
  };

  const handleJoinGroup = async (groupObj) => {
    if (!student?.id) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/community-groups/${groupObj.id}/join?studentId=${student.id}`);
      alert(`🎉 Congratulations! You have successfully joined "${groupObj.groupName}"!`);
      setMyJoinedGroup(res.data);
      setInspectModal(false);
      fetchData();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to join group.';
      alert(`❌ ${errMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaveGroup = async (groupObj) => {
    if (!student?.id) return;
    const confirmLeave = window.confirm(`Are you sure you want to leave "${groupObj.groupName}"?`);
    if (!confirmLeave) return;

    setSubmitting(true);
    try {
      await api.post(`/community-groups/${groupObj.id}/leave?studentId=${student.id}`);
      alert(`You have left "${groupObj.groupName}".`);
      setMyJoinedGroup(null);
      setInspectModal(false);
      fetchData();
    } catch (err) {
      alert('Failed to leave group.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardClick = (groupObj) => {
    setSelectedGroup(groupObj);
    setInspectModal(true);
  };

  if (loading) return <LoadingSpinner label="Loading community group openings & teams..." />;

  if (!myCommunities || myCommunities.length === 0) {
    return (
      <div className="space-y-8 p-4 lg:p-8">
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-4 shadow-xl">
          <Building2 className="w-16 h-16 text-[#7c3aed]/50 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-[#7c3aed]xl font-extrabold text-slate-900">No Communities Joined Yet</h2>
            <p className="text-xs md:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              You haven't joined any community chapter yet. Group openings are strictly available for your registered communities. Please explore and join a community first to view open student groups!
            </p>
          </div>
          <Link
            to="/student/communities"
            className="px-6 py-3 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold transition shadow-sm text-black font-bold text-xs inline-flex items-center gap-2 shadow-sm"
          >
            <Users className="w-4 h-4 text-black" /> Explore & Join Communities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2 lg:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#7c3aed] uppercase tracking-widest flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#8b5cf6]" /> Student Team Openings & Roster
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Group Openings & My Team
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Browse open student project groups created by Student Leaders. Touch/click any card to view the Team Leader & Roster!
          </p>
        </div>

        {/* Community Scope Selector */}
        {myCommunities.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-700 font-bold uppercase">Community Scope:</label>
            <select
              value={selectedCommunityId}
              onChange={(e) => handleCommunityChange(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-semibold focus:outline-none focus:border-[#8b5cf6]"
            >
              {myCommunities.map((m) => (
                <option key={m.id} value={m.communityId} className="bg-white text-slate-900">
                  {m.communityName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* JOINED GROUP PROMINENT BANNER (Shown when student has joined a group) */}
      {myJoinedGroup && (
        <div className="bg-white p-6 lg:p-8 rounded-3xl border border-purple-200 space-y-6 shadow-md bg-gradient-to-r from-purple-50 via-white to-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                ✓ My Joined Team
              </span>
              <h2 className="text-[#7c3aed]xl md:text-3xl font-extrabold text-slate-900 mt-2 flex items-center gap-2">
                {myJoinedGroup.groupName}
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                {myJoinedGroup.description || 'Active student project team.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCardClick(myJoinedGroup)}
                className="px-4 py-2.5 rounded-xl bg-purple-50 text-[#7c3aed] border border-purple-200 hover:bg-purple-100 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Info className="w-4 h-4 text-[#8b5cf6]" /> View Full Roster Modal
              </button>
              <button
                onClick={() => handleLeaveGroup(myJoinedGroup)}
                disabled={submitting}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5" /> Leave Group
              </button>
            </div>
          </div>

          {/* TEAM LEADER & MEMBERS SUMMARY DISPLAY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEADER PROFILE CARD */}
            <div className="bg-purple-50/60 p-5 rounded-2xl border border-purple-100 space-y-3">
              <div className="flex items-center gap-2 text-[#7c3aed] font-bold text-xs uppercase tracking-wider">
                <Crown className="w-4 h-4 text-[#8b5cf6]" /> Team Leader Profile
              </div>
              <div className="space-y-1">
                <div className="font-extrabold text-slate-900 text-lg">{myJoinedGroup.leaderStudentName}</div>
                <div className="text-xs font-mono text-[#7c3aed] font-bold">Reg #{myJoinedGroup.leaderStudentCode}</div>
                <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-1 font-medium">
                  <GraduationCap className="w-3.5 h-3.5 text-[#8b5cf6]" /> {myJoinedGroup.leaderDepartment}
                </div>
              </div>
            </div>

            {/* TEAM MEMBERS ROSTER LIST */}
            <div className="lg:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                  <Users className="w-4 h-4 text-[#8b5cf6]" /> Joined Team Roster ({myJoinedGroup.members?.length || 0} / {myJoinedGroup.maxTeamSize})
                </div>
                <span className="text-[10px] font-mono text-[#7c3aed] font-bold">
                  {myJoinedGroup.maxTeamSize - (myJoinedGroup.members?.length || 0)} Open Slots Left
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myJoinedGroup.members && myJoinedGroup.members.length > 0 ? (
                  myJoinedGroup.members.map((m) => {
                    const isLeader = m.role === 'LEADER' || m.studentId === myJoinedGroup.leaderStudentId;
                    return (
                      <div
                        key={m.id}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                          isLeader ? 'bg-purple-100/70 border-purple-200 text-purple-950 font-bold' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1">
                            {isLeader && <Crown className="w-3.5 h-3.5 text-[#7c3aed]" />}
                            <span className="font-extrabold">{m.studentName}</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">{m.department} • #{m.studentCode}</div>
                        </div>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isLeader ? 'bg-[#8b5cf6] text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {isLeader ? 'LEADER' : 'MEMBER'}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-slate-500">No roster entries logged.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALL GROUP OPENINGS CARDS GRID (Shown ONLY when student has NOT joined a group) */}
      {!myJoinedGroup && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#8b5cf6]" /> Community Group Openings ({groups.length})
            </span>
            <span className="text-xs font-mono text-slate-500 font-normal">
              Touch/click card to inspect team leader & members
            </span>
          </h3>

          {groups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((g) => {
                const isMemberOfGroup = myJoinedGroup?.id === g.id;
                const isFull = g.currentMemberCount >= g.maxTeamSize;
                const percentFilled = Math.min(100, Math.round((g.currentMemberCount / g.maxTeamSize) * 100));

                return (
                  <div
                    key={g.id}
                    onClick={() => handleCardClick(g)}
                    className={`bg-white p-6 rounded-2xl border cursor-pointer space-y-4 flex flex-col justify-between transition group hover:scale-[1.01] shadow-sm ${
                      isMemberOfGroup
                        ? 'border-[#8b5cf6] bg-purple-50/50'
                        : 'border-slate-200 hover:border-[#8b5cf6]/50 hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7c3aed] border border-purple-200">
                          {g.communityName || 'Chapter Group'}
                        </span>
                        <Badge status={isFull ? 'FULL' : 'OPEN'}>{isFull ? 'FULL' : 'OPEN'}</Badge>
                      </div>

                      <div>
                        <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-[#7c3aed] transition flex items-center justify-between">
                          {g.groupName}
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {g.description || 'Click to view team leader, members & details.'}
                        </p>
                      </div>

                      {/* Team Leader Quick Strip */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Team Leader</div>
                          <div className="font-extrabold text-slate-800 flex items-center gap-1">
                            <Crown className="w-3.5 h-3.5 text-[#8b5cf6]" /> {g.leaderStudentName}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-[#7c3aed] font-bold">{g.leaderDepartment}</span>
                      </div>

                      {/* Capacity Gauge Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-500 font-semibold">Team Capacity:</span>
                          <span className="font-bold text-[#7c3aed]">
                            {g.currentMemberCount} / {g.maxTeamSize} Members
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isFull ? 'bg-rose-500' : 'bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6]'
                            }`}
                            style={{ width: `${percentFilled}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="pt-3 border-t border-slate-100">
                      {isMemberOfGroup ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLeaveGroup(g);
                          }}
                          className="w-full py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Joined • Leave Group
                        </button>
                      ) : isFull ? (
                        <button
                          disabled
                          className="w-full py-2 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold cursor-not-allowed"
                        >
                          Group Capacity Full ({g.maxTeamSize}/{g.maxTeamSize})
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinGroup(g);
                          }}
                          disabled={submitting}
                          className="w-full py-2 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-slate-900" /> Touch Card / Join Group
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
              <Users className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-lg font-bold text-slate-800">No Group Openings Available</h4>
              <p className="text-xs text-slate-500">
                No active student groups have been created under {myCommunities.find(m => m.communityId.toString() === selectedCommunityId)?.communityName || 'this community'} yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* INTERACTIVE TOUCH/CLICK CARD INSPECTOR MODAL */}
      {selectedGroup && (
        <Modal
          isOpen={inspectModal}
          onClose={() => setInspectModal(false)}
          title={`Team Details: ${selectedGroup.groupName}`}
        >
          <div className="space-y-6 text-xs text-slate-800">
            {/* Header info */}
            <div>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7c3aed] font-bold border border-purple-200">
                {selectedGroup.communityName || 'Community Chapter'}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">{selectedGroup.groupName}</h3>
              <p className="text-xs text-slate-600 mt-1">
                {selectedGroup.description || 'No detailed description provided.'}
              </p>
            </div>

            {/* Team Leader Card Banner */}
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-1">
              <div className="text-[10px] font-mono text-[#7c3aed] uppercase font-bold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-[#8b5cf6]" /> Team Leader
              </div>
              <div className="text-sm font-bold text-slate-900">{selectedGroup.leaderStudentName}</div>
              <div className="text-xs font-mono text-slate-600">
                Student Reg #{selectedGroup.leaderStudentCode} • Dept: {selectedGroup.leaderDepartment}
              </div>
            </div>

            {/* Members Roster List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                <span>Joined Team Members ({selectedGroup.members?.length || 0} / {selectedGroup.maxTeamSize})</span>
                <span className="text-xs font-mono text-[#7c3aed] font-bold">
                  {selectedGroup.maxTeamSize - (selectedGroup.members?.length || 0)} Open Slots
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedGroup.members && selectedGroup.members.length > 0 ? (
                  selectedGroup.members.map((m) => {
                    const isLeader = m.role === 'LEADER' || m.studentId === selectedGroup.leaderStudentId;
                    return (
                      <div
                        key={m.id}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isLeader ? 'bg-purple-100/70 border-purple-200 text-purple-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1 text-xs">
                            {isLeader && <Crown className="w-3.5 h-3.5 text-[#7c3aed]" />}
                            <span className="font-bold">{m.studentName}</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">
                            Reg #{m.studentCode} • Dept: {m.department}
                          </div>
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isLeader ? 'bg-[#8b5cf6] text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {isLeader ? 'LEADER' : 'MEMBER'}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-slate-500">No members in team yet.</div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setInspectModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Close
              </button>

              {myJoinedGroup?.id === selectedGroup.id ? (
                <button
                  type="button"
                  onClick={() => handleLeaveGroup(selectedGroup)}
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Leave Group
                </button>
              ) : selectedGroup.currentMemberCount >= selectedGroup.maxTeamSize ? (
                <button
                  disabled
                  className="px-5 py-2 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 font-bold cursor-not-allowed"
                >
                  Team Full
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleJoinGroup(selectedGroup)}
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                >
                  <UserPlus className="w-3.5 h-3.5 text-slate-900" /> Join This Group
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GroupOpeningsPage;
