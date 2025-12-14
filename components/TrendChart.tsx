import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { day: 'MON', value: 65 },
  { day: 'TUE', value: 68 },
  { day: 'WED', value: 75 },
  { day: 'THU', value: 72 },
  { day: 'FRI', value: 60 },
  { day: 'SAT', value: 85 },
  { day: 'SUN', value: 70 },
];

const TrendChart: React.FC = () => {
  return (
    <div className="bg-health-card p-6 rounded-3xl border border-white/5 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Heart Rate Trends</h3>
          <p className="text-health-muted text-xs">Last 7 days monitoring</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-gray-300">Avg 72 bpm</span>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#ffffff10" strokeDasharray="3 3" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 10 }} 
              dy={10}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px', color: '#F3F4F6' }}
              itemStyle={{ color: '#10B981' }}
              cursor={{ stroke: '#ffffff20' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#10B981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
            {/* Custom dots could be added via a custom dot component, but default circles are okay for now */}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;