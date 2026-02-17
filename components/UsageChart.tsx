
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface UsageChartProps {
  data: any[];
  color?: string;
  type: 'line' | 'area';
}

const UsageChart: React.FC<UsageChartProps> = ({ data, color = "#3b82f6", type }) => {
  return (
    <div className="h-24 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? (
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
            <Tooltip hidden />
          </LineChart>
        ) : (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;
