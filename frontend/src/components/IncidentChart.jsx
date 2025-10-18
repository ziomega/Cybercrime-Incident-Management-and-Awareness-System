import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const defaultData = [
  { month: 'Jan', incidents: 45, resolved: 38 },
  { month: 'Feb', incidents: 52, resolved: 45 },
  { month: 'Mar', incidents: 48, resolved: 42 },
  { month: 'Apr', incidents: 61, resolved: 52 },
  { month: 'May', incidents: 55, resolved: 48 },
  { month: 'Jun', incidents: 67, resolved: 58 },
  { month: 'Jul', incidents: 72, resolved: 65 },
  { month: 'Aug', incidents: 68, resolved: 61 },
  { month: 'Sep', incidents: 75, resolved: 68 },
  { month: 'Oct', incidents: 82, resolved: 70 },
];

export function IncidentChart({ data }) {
  const chartData = data && data.length > 0 ? data : defaultData;
  return (
    <div className="w-full rounded-lg border border-gray-700 bg-black shadow-lg backdrop-blur-sm">
      <div className="p-6 pb-4">
        <h3 className="text-2xl font-semibold tracking-tight text-white">Incident Trends</h3>
        <p className="text-sm text-gray-400 mt-1">Monthly incident reports and resolution rates</p>
      </div>
      <div className="p-6 pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#000000" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#000000" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#666" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="#999"
              tick={{ fill: '#d1d5db', fontSize: 12 }}
            />
            <YAxis 
              stroke="#999"
              tick={{ fill: '#d1d5db', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937',
                backdropFilter: 'blur(8px)',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: '#ffffff'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="incidents" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorIncidents)"
              strokeWidth={3}
            />
            <Area 
              type="monotone" 
              dataKey="resolved" 
              stroke="#1d4ed8" 
              fillOpacity={1} 
              fill="url(#colorResolved)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default IncidentChart;