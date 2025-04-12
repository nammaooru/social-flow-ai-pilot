
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sample data
const data = [
  { name: 'Mon', likes: 120, comments: 45, shares: 23 },
  { name: 'Tue', likes: 145, comments: 52, shares: 28 },
  { name: 'Wed', likes: 210, comments: 67, shares: 42 },
  { name: 'Thu', likes: 198, comments: 63, shares: 38 },
  { name: 'Fri', likes: 245, comments: 78, shares: 52 },
  { name: 'Sat', likes: 320, comments: 92, shares: 64 },
  { name: 'Sun', likes: 280, comments: 85, shares: 57 },
];

const EngagementChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="likes" 
                stroke="#3B82F6" 
                strokeWidth={2} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="comments" 
                stroke="#10B981" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="shares" 
                stroke="#F59E0B" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementChart;
