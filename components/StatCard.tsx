import React from 'react';
import { Heart, Droplets, Scale } from 'lucide-react';
import { HealthMetric } from '../types';

const StatCard: React.FC<{ metric: HealthMetric }> = ({ metric }) => {
  const getIcon = () => {
    switch (metric.icon) {
      case 'heart': return <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />;
      case 'droplet': return <Droplets className="w-6 h-6 text-blue-400 fill-blue-400/20" />;
      case 'scale': return <Scale className="w-6 h-6 text-orange-400 fill-orange-400/20" />;
    }
  };

  const getStatusColor = () => {
    if (metric.status === 'Improving') return 'bg-emerald-500/20 text-emerald-400';
    if (metric.status === 'Worsening') return 'bg-rose-500/20 text-rose-400';
    if (metric.status === 'Stable') return 'bg-blue-500/20 text-blue-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="bg-health-card p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-2xl">
          {getIcon()}
        </div>
        {metric.trendValue && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {metric.trendValue} {metric.status}
          </span>
        )}
        {!metric.trendValue && metric.status && (
           <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
           {metric.status}
         </span>
        )}
      </div>
      <div>
        <p className="text-health-muted text-sm font-medium mb-1">{metric.label}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-3xl font-bold text-white">{metric.value}</h3>
          <span className="text-health-muted text-sm">{metric.unit}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;