import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { time: '0-2h', urgent: 12, high: 8, medium: 5, low: 2 },
  { time: '2-4h', urgent: 8, high: 15, medium: 12, low: 6 },
  { time: '4-8h', urgent: 3, high: 10, medium: 18, low: 15 },
  { time: '8-24h', urgent: 1, high: 5, medium: 20, low: 25 },
  { time: '24h+', urgent: 0, high: 2, medium: 8, low: 20 },
];

export function ResponseTimeGraph() {
  return (
    <div className="w-full rounded-lg border border-gray-700 bg-black shadow-lg backdrop-blur-sm my-6">
      <div className="p-6 pb-4">
        <h3 className="text-2xl font-semibold tracking-tight text-white">Response Time Analysis</h3>
        <p className="text-sm text-gray-400 mt-1">Average response time by incident priority</p>
      </div>
      <div className="p-6 pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#666" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#999"
              tick={{ fill: '#d1d5db', fontSize: 11 }}
            />
            <YAxis 
              stroke="#999"
              tick={{ fill: '#d1d5db', fontSize: 12 }}
              label={{ value: 'Incidents', angle: -90, position: 'insideLeft', fill: '#d1d5db' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937',
                backdropFilter: 'blur(8px)',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: '#ffffff'
              }}
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Legend 
              wrapperStyle={{ 
                color: '#ffffff',
                paddingTop: '20px'
              }}
              iconType="circle"
            />
            <Bar 
              dataKey="urgent" 
              fill="#ef4444" 
              radius={[6, 6, 0, 0]} 
              name="Urgent"
              animationDuration={800}
            />
            <Bar 
              dataKey="high" 
              fill="#f97316" 
              radius={[6, 6, 0, 0]} 
              name="High"
              animationDuration={800}
            />
            <Bar 
              dataKey="medium" 
              fill="#3b82f6" 
              radius={[6, 6, 0, 0]} 
              name="Medium"
              animationDuration={800}
            />
            <Bar 
              dataKey="low" 
              fill="#10b981" 
              radius={[6, 6, 0, 0]} 
              name="Low"
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ResponseTimeGraph;
