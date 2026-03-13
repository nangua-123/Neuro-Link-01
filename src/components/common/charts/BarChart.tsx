import React from 'react';
import { BarChart as RechartsBarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

interface BarChartProps {
  data: any[];
  dataKey: string;
  color: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, dataKey, color }) => {
  return (
    <div className="w-full h-full opacity-30 pointer-events-none">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barSize={8}>
          <Bar dataKey={dataKey} radius={[4, 4, 4, 4]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={color} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
