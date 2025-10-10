import { MapPin, TrendingUp, AlertTriangle, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

const IncidentHotspots = ({ hotspots }) => {
  // Default hotspot data if not provided
  const defaultHotspots = [
    { location: 'Downtown', incidents: 45, severity: 'high', position: { top: '45%', left: '55%' } },
    { location: 'Industrial Area', incidents: 38, severity: 'critical', position: { top: '25%', left: '70%' } },
    { location: 'Residential Zone', incidents: 32, severity: 'medium', position: { top: '60%', left: '40%' } },
    { location: 'Business District', incidents: 28, severity: 'high', position: { top: '35%', left: '45%' } },
    { location: 'Suburban Area', incidents: 22, severity: 'medium', position: { top: '70%', left: '60%' } },
    { location: 'Tech Park', incidents: 18, severity: 'low', position: { top: '20%', left: '30%' } },
    { location: 'University Area', incidents: 15, severity: 'low', position: { top: '80%', left: '35%' } },
  ];

  const data = hotspots || defaultHotspots;
  
  // Sort by incidents descending
  const sortedData = [...data].sort((a, b) => b.incidents - a.incidents);
  const topHotspots = sortedData.slice(0, 5);

  // Color mapping for severity
  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#ef4444',
      high: '#f97316',
      medium: '#3b82f6',
      low: '#10b981',
    };
    return colors[severity] || colors.medium;
  };

  const getSeverityBg = (severity) => {
    const colors = {
      critical: 'bg-red-500/20 border-red-500/30',
      high: 'bg-orange-500/20 border-orange-500/30',
      medium: 'bg-blue-500/20 border-blue-500/30',
      low: 'bg-green-500/20 border-green-500/30',
    };
    return colors[severity] || colors.medium;
  };

  // Calculate marker size based on incidents
  const getMarkerSize = (incidents) => {
    const maxIncidents = Math.max(...data.map(d => d.incidents));
    const minSize = 30;
    const maxSize = 80;
    return minSize + ((incidents / maxIncidents) * (maxSize - minSize));
  };

  return (
    <div className="w-full rounded-lg border border-gray-700 bg-black shadow-lg backdrop-blur-sm my-6">
      <div className="p-6 pb-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
              <MapPin className="h-6 w-6 text-red-400" />
              Incident Hotspots
            </h3>
            <p className="text-sm text-gray-400 mt-1">High-risk areas with most incidents</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-red-400" />
            <span className="text-gray-400">Last 30 days</span>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Visualization Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Geographic Distribution</h4>
            <Navigation className="h-4 w-4 text-blue-400" />
          </div>
          
          {/* Map Container */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700 h-[400px] overflow-hidden">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4b5563" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Street/Area lines for realism */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
              <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#6b7280" strokeWidth="2" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#6b7280" strokeWidth="2" />
              <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#6b7280" strokeWidth="2" />
              <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#6b7280" strokeWidth="2" />
              <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#6b7280" strokeWidth="2" />
            </svg>

            {/* Hotspot Markers */}
            {sortedData.map((hotspot, index) => {
              const size = getMarkerSize(hotspot.incidents);
              const color = getSeverityColor(hotspot.severity);
              
              return (
                <motion.div
                  key={hotspot.location}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 200
                  }}
                  className="absolute cursor-pointer group"
                  style={{
                    top: hotspot.position?.top || `${Math.random() * 80 + 10}%`,
                    left: hotspot.position?.left || `${Math.random() * 80 + 10}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {/* Pulsing ring effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      border: `3px solid ${color}`,
                      opacity: 0.6
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 0, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Main marker */}
                  <div
                    className="relative rounded-full flex items-center justify-center shadow-2xl"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: color,
                      boxShadow: `0 0 ${size/2}px ${color}`
                    }}
                  >
                    <span className="text-white font-bold text-sm">
                      {hotspot.incidents}
                    </span>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                      <div className="text-white font-semibold text-sm">{hotspot.location}</div>
                      <div className="text-gray-400 text-xs">{hotspot.incidents} incidents</div>
                      <div className={`text-xs font-medium capitalize ${
                        hotspot.severity === 'critical' ? 'text-red-400' :
                        hotspot.severity === 'high' ? 'text-orange-400' :
                        hotspot.severity === 'medium' ? 'text-blue-400' :
                        'text-green-400'
                      }`}>
                        {hotspot.severity} severity
                      </div>
                    </div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Map Legend Overlay */}
            <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2">
              <div className="text-xs text-gray-400 font-medium mb-1">Bubble Size</div>
              <div className="text-xs text-gray-300">= Incident Count</div>
            </div>
          </div>
        </div>

        {/* Top Hotspots List */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Top 5 Hotspots</h4>
          <div className="space-y-3">
            {topHotspots.map((hotspot, index) => (
              <motion.div
                key={hotspot.location}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`
                  relative overflow-hidden rounded-lg border p-4
                  ${getSeverityBg(hotspot.severity)}
                  backdrop-blur-sm
                  hover:scale-[1.02] transition-all duration-200
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-white font-semibold">{hotspot.location}</h5>
                        <span className={`
                          text-xs px-2 py-0.5 rounded-full uppercase font-medium
                          ${hotspot.severity === 'critical' ? 'bg-red-500/30 text-red-300' : ''}
                          ${hotspot.severity === 'high' ? 'bg-orange-500/30 text-orange-300' : ''}
                          ${hotspot.severity === 'medium' ? 'bg-blue-500/30 text-blue-300' : ''}
                          ${hotspot.severity === 'low' ? 'bg-green-500/30 text-green-300' : ''}
                        `}>
                          {hotspot.severity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <AlertTriangle className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {hotspot.incidents} incidents reported
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {hotspot.incidents}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(hotspot.incidents / sortedData[0].incidents) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-full"
                    style={{ backgroundColor: getSeverityColor(hotspot.severity) }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <h5 className="text-sm font-medium text-gray-400 mb-3">Severity Levels</h5>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Critical', color: '#ef4444', severity: 'critical' },
                { label: 'High', color: '#f97316', severity: 'high' },
                { label: 'Medium', color: '#3b82f6', severity: 'medium' },
                { label: 'Low', color: '#10b981', severity: 'low' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentHotspots;
