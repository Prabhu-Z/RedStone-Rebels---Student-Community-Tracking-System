import React from 'react';
import { Calendar, Award, CheckCircle2, Users, FileCheck, Star } from 'lucide-react';
import Badge from './Badge';

const Timeline = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'COMMUNITY_JOINED':
        return <Users className="w-4 h-4 text-morning-400" />;
      case 'WORKSHOP_ATTENDED':
      case 'EVENT_REGISTERED':
        return <Calendar className="w-4 h-4 text-[#7c3aed]" />;
      case 'COMPETITION_WON':
        return <Award className="w-4 h-4 text-[#7c3aed]" />;
      case 'VOLUNTEER_SERVICE':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Star className="w-4 h-4 text-chestnut-400" />;
    }
  };

  if (!activities || activities.length === 0) {
    return <div className="text-center py-8 text-slate-500 font-medium">No activity timeline recorded yet.</div>;
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#8b5cf6]/40">
      {activities.map((act, idx) => (
        <div key={idx} className="relative group">
          <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-white border-2 border-[#8b5cf6] flex items-center justify-center shadow-md group-hover:scale-110 transition">
            {getActivityIcon(act.activityType)}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-[#8b5cf6]/40 transition shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#7c3aed] font-mono">
                {act.activityDate}
              </span>
              <Badge status={act.role}>{act.role}</Badge>
            </div>

            <h4 className="text-base font-extrabold text-slate-900 mt-1">
              {act.communityName}
            </h4>

            {act.eventTitle && (
              <p className="text-sm font-medium text-slate-700 mt-0.5">
                Event: <span className="text-[#7c3aed] font-bold">{act.eventTitle}</span>
              </p>
            )}

            {act.contribution && (
              <p className="text-xs text-slate-600 mt-1">
                <strong className="text-slate-800">Contribution:</strong> {act.contribution}
              </p>
            )}

            {act.description && (
              <p className="text-xs text-slate-500 mt-1 italic">
                "{act.description}"
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
