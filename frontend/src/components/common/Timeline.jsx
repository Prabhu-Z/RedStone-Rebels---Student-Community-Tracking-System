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
        return <Calendar className="w-4 h-4 text-warmgold-400" />;
      case 'COMPETITION_WON':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'VOLUNTEER_SERVICE':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Star className="w-4 h-4 text-chestnut-400" />;
    }
  };

  if (!activities || activities.length === 0) {
    return <div className="text-center py-8 text-stardustsilver-300/50">No activity timeline recorded yet.</div>;
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-warmgold-500/50 before:to-chestnut-700/20">
      {activities.map((act, idx) => (
        <div key={idx} className="relative group">
          <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-arsenic-900 border border-warmgold-500/50 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
            {getActivityIcon(act.activityType)}
          </div>

          <div className="glass-card p-4 rounded-xl border border-stardustsilver-300/15 hover:border-warmgold-500/30 transition">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-warmgold-400 font-mono">
                {act.activityDate}
              </span>
              <Badge status={act.role}>{act.role}</Badge>
            </div>

            <h4 className="font-serif text-base font-bold text-white mt-1">
              {act.communityName}
            </h4>

            {act.eventTitle && (
              <p className="text-sm font-medium text-almond-200 mt-0.5">
                Event: <span className="text-morning-300">{act.eventTitle}</span>
              </p>
            )}

            {act.contribution && (
              <p className="text-xs text-stardustsilver-300/80 mt-1">
                <strong className="text-chestnut-300">Contribution:</strong> {act.contribution}
              </p>
            )}

            {act.description && (
              <p className="text-xs text-stardustsilver-300/60 mt-1 italic">
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
