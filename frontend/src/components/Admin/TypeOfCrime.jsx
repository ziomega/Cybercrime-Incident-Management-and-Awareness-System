import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Shield, AlertTriangle, FileText, Wifi, CreditCard, Mail, Globe, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const TypeOfCrime = ({ data }) => {
  // Default crime type data
  console.log("TypeOfCrime received data:", data);
  const defaultData = [
    { 
      type: 'Phishing', 
      count: 145, 
      percentage: 28.5,
      icon: Mail,
      color: '#ef4444',
      severity: 'High',
      trend: '+12%'
    },
    { 
      type: 'Identity Theft', 
      count: 98, 
      percentage: 19.3,
      icon: Shield,
      color: '#f97316',
      severity: 'Critical',
      trend: '+8%'
    },
    { 
      type: 'Ransomware', 
      count: 87, 
      percentage: 17.1,
      icon: Lock,
      color: '#8b5cf6',
      severity: 'Critical',
      trend: '-5%'
    },
    { 
      type: 'Data Breach', 
      count: 76, 
      percentage: 15.0,
      icon: FileText,
      color: '#3b82f6',
      severity: 'High',
      trend: '+15%'
    },
    { 
      type: 'Credit Card Fraud', 
      count: 54, 
      percentage: 10.6,
      icon: CreditCard,
      color: '#06b6d4',
      severity: 'Medium',
      trend: '+3%'
    },
    { 
      type: 'Network Attack', 
      count: 32, 
      percentage: 6.3,
      icon: Wifi,
      color: '#10b981',
      severity: 'Medium',
      trend: '-2%'
    },
    { 
      type: 'Social Engineering', 
      count: 16, 
      percentage: 3.2,
      icon: Globe,
      color: '#f59e0b',
      severity: 'Low',
      trend: '+6%'
    },
  ];

  const crimeData = data || defaultData;
  const totalCrimes = crimeData.reduce((sum, item) => sum + item.count, 0);

  // Prepare data for pie chart
  const pieData = crimeData.map(item => ({
    name: item.type,
    value: item.count,
    color: item.color
  }));

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'text-red-400 bg-red-500/20';
      case 'High': return 'text-orange-400 bg-orange-500/20';
      case 'Medium': return 'text-blue-400 bg-blue-500/20';
      case 'Low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="w-full rounded-lg border border-gray-700 bg-black shadow-lg backdrop-blur-sm my-6">
      <div className="p-6 pb-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-400" />
              Crime Type Distribution
            </h3>
            <p className="text-sm text-gray-400 mt-1">Analysis of incidents by crime category</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{totalCrimes}</div>
            <div className="text-xs text-gray-500">Total Incidents</div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart Section */}
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
          <h4 className="text-lg font-semibold text-white mb-4">Distribution Overview</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <defs>
                {pieData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={entry.color} stopOpacity={0.9}/>
                    <stop offset="95%" stopColor={entry.color} stopOpacity={0.6}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
                stroke="#1f2937"
                strokeWidth={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#000000',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid #4b5563',
                  borderRadius: '10px',
                  color: '#ffffff',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                  padding: '12px'
                }}
                itemStyle={{ color: '#e5e7eb', fontSize: '14px', fontWeight: '500' }}
                labelStyle={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ 
                  color: '#e5e7eb', 
                  fontSize: '12px',
                  paddingTop: '10px'
                }}
                formatter={(value) => <span style={{ color: '#e5e7eb' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart Section */}
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
          <h4 className="text-lg font-semibold text-white mb-4">Incident Count by Type</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={crimeData}>
              <defs>
                {crimeData.map((entry, index) => (
                  <linearGradient key={`bar-gradient-${index}`} id={`bar-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={entry.color} stopOpacity={0.9}/>
                    <stop offset="95%" stopColor={entry.color} stopOpacity={0.5}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
              <XAxis 
                dataKey="type" 
                stroke="#6b7280"
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#000000',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid #4b5563',
                  borderRadius: '10px',
                  color: '#ffffff',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                  padding: '12px'
                }}
                itemStyle={{ color: '#e5e7eb', fontSize: '14px', fontWeight: '500' }}
                labelStyle={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}
                cursor={{ fill: 'rgba(75, 85, 99, 0.2)' }}
              />
              <Bar 
                dataKey="count" 
                radius={[8, 8, 0, 0]}
                animationDuration={800}
              >
                {crimeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#bar-gradient-${index})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed List */}
      <div className="p-6 pt-0">
        <h4 className="text-lg font-semibold text-white mb-4">Detailed Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {crimeData.map((crime, index) => {
            const Icon = crime.icon || AlertTriangle;
            const isPositiveTrend = crime.trend?.startsWith?.('+') || false;
            
            return (
              <motion.div
                key={crime.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative overflow-hidden rounded-lg border border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${crime.color}20` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: crime.color }} />
                    </div>
                    <div>
                      <h5 className="text-white font-semibold text-sm">{crime.type}</h5>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(crime.severity)}`}>
                        {crime.severity}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{crime.count}</div>
                    <div className="text-xs text-gray-500">incidents</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-400">{crime.percentage}%</div>
                    <div className={`text-xs font-medium ${isPositiveTrend ? 'text-red-400' : 'text-green-400'}`}>
                      {crime.trend} MoM
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${crime.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.05 }}
                    className="h-full"
                    style={{ backgroundColor: crime.color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TypeOfCrime;
