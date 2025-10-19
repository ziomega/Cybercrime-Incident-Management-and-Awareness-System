import RoleBasedTab from "../../components/RoleBasedTab";
import IncidentChart from "../IncidentChart";
import ResponseTimeGraph from "./ResponseTimeGraph";
import { useState, useEffect } from "react";
import IncidentCards from "./IncidentCards";
import IncidentHotspots from "./IncidentHotspots";
import SystemMetrics from "../SystemMetrics";
import TypeOfCrime from "./TypeOfCrime";
import AllIncidents from "./AllIncidents";
import Users from "./Users";
import AssignCase from "./AssignCase";
import axiosInstance from "../../api/axiosConfig";
import { CheckCircle, Users as UsersIcon, Clock, BarChart3, Mail, Shield, Lock, FileText, CreditCard, Wifi, Globe, AlertTriangle } from 'lucide-react';
import ActivityLog from "./ActivityLog";


function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [detailedAnalytics, setDetailedAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/analytics/summary');
        setAnalyticsData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  useEffect(() => {
    const fetchDetailedAnalytics = async () => {
      if (activeTab === 'analytics') {
        try {
          const response = await axiosInstance.get('/analytics/detailed');
          setDetailedAnalytics(response.data);
        } catch (err) {
          console.error('Error fetching detailed analytics:', err);
        }
      }
    };

    fetchDetailedAnalytics();
  }, [activeTab]);

  // Transform API data for IncidentCards
  const incidentStats = analyticsData ? {
    total: analyticsData.total_cases || 0,
    critical: analyticsData.critical_cases || 0,
    solved: analyticsData.solved_cases || 0,
    pending: (analyticsData.total_cases || 0) - (analyticsData.in_progress_cases || 0) - (analyticsData.resolved_cases || 0) - (analyticsData.rejected || 0),
    inProgress: analyticsData.in_progress_cases || 0,
    rejected: analyticsData.rejected || 0,
  } : null;

  // Transform API graph data for IncidentChart
  const chartData = analyticsData?.graph_data ? 
    analyticsData.graph_data.weeks.map((week, index) => ({
      month: week,
      incidents: analyticsData.graph_data.created[index] || 0,
      resolved: analyticsData.graph_data.resolved[index] || 0,
    })) : [];

  // Transform detailed analytics data for analytics tab
  const systemMetricsData = detailedAnalytics ? [
    {
      title: 'Cases Solved',
      value: detailedAnalytics.case_solved || 0,
      previous: (detailedAnalytics.case_solved || 0) - (detailedAnalytics.case_solved_change || 0),
      unit: 'cases',
      icon: CheckCircle,
      color: 'green',
      analytics: `${detailedAnalytics.case_solved_change >= 0 ? 'Up' : 'Down'} ${Math.abs(detailedAnalytics.case_solved_change || 0)} from last month`,
    },
    {
      title: 'New Users',
      value: detailedAnalytics.new_users || 0,
      previous: (detailedAnalytics.new_users || 0) - (detailedAnalytics.new_users_change || 0),
      unit: 'users',
      icon: UsersIcon,
      color: 'blue',
      analytics: `${detailedAnalytics.new_users_change >= 0 ? 'Up' : 'Down'} ${Math.abs(detailedAnalytics.new_users_change || 0)} from last month`,
    },
    {
      title: 'Avg Response Time',
      value: detailedAnalytics.avg_resolution_time || 0,
      previous: (detailedAnalytics.avg_resolution_time || 0) - (detailedAnalytics.avg_resolution_time_change || 0),
      unit: 'hrs',
      icon: Clock,
      color: 'purple',
      analytics: `${detailedAnalytics.avg_resolution_time_change <= 0 ? 'Improved' : 'Increased'} by ${Math.abs(detailedAnalytics.avg_resolution_time_change || 0)} hrs`,
      lowerIsBetter: true,
    },
    {
      title: 'Efficiency',
      value: `${Math.round(detailedAnalytics.efficiency || 0)}%`,
      previous: `${Math.round((detailedAnalytics.efficiency || 0) - (detailedAnalytics.efficiency_change || 0))}%`,
      unit: 'efficiency',
      icon: BarChart3,
      color: 'orange',
      analytics: `${detailedAnalytics.efficiency_change >= 0 ? 'Up' : 'Down'} ${Math.abs(Math.round(detailedAnalytics.efficiency_change || 0))}% from last month`,
    },
  ] : null;

  // Transform incident trend graph data
  const incidentTrendData = detailedAnalytics?.incident_trend_graph?.months?.map((month, index) => ({
    month: month,
    incidents: detailedAnalytics.incident_trend_graph.created[index] || 0,
    resolved: detailedAnalytics.incident_trend_graph.resolved[index] || 0,
  })) || [];

  // Transform category graph data for TypeOfCrime
  const iconList = [Mail, Shield, Lock, FileText, CreditCard, Wifi, Globe, AlertTriangle];
  const categoryData = detailedAnalytics?.category_graph?.categories?.map((category, index) => ({
    type: category || 'Unknown',
    count: detailedAnalytics.category_graph.counts[index] || 0,
    percentage: ((detailedAnalytics.category_graph.counts[index] || 0) / 
                 detailedAnalytics.category_graph.counts.reduce((a, b) => a + b, 0) * 100).toFixed(1),
    icon: iconList[index % iconList.length],
    color: ['#ef4444', '#f97316', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'][index % 7],
    severity: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
    trend: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 15)}%`,
  })).filter(item => item.count > 0).slice(0, 10) || [];

  // Transform time taken graph data for ResponseTimeGraph
  const responseTimeData = detailedAnalytics?.time_taken_graph ? (() => {
    const priorities = detailedAnalytics.time_taken_graph.priorities || [];
    const timeTaken = detailedAnalytics.time_taken_graph.time_taken || {};
    const counts = detailedAnalytics.time_taken_graph.counts || {};
    
    // Create time ranges
    const timeRanges = ['0-2h', '2-4h', '4-8h', '8-24h', '24h+'];
    
    return timeRanges.map(range => {
      const dataPoint = { time: range };
      priorities.forEach(priority => {
        // Distribute counts across time ranges (simplified)
        const priorityCounts = counts[priority] || [0];
        const avgCount = priorityCounts.reduce((a, b) => a + b, 0) / timeRanges.length;
        dataPoint[priority] = Math.round(avgCount);
      });
      return dataPoint;
    });
  })() : [];

  // Transform hotspot graph data
  const hotspotData = detailedAnalytics?.hotspot_graph?.cities?.map((city, index) => ({
    location: city || 'Unknown',
    incidents: detailedAnalytics.hotspot_graph.counts[index] || 0,
    severity: ['critical', 'high', 'medium', 'low'][Math.floor(index / 3) % 4],
    position: {
      top: `${20 + (index * 7) % 60}%`,
      left: `${30 + (index * 11) % 50}%`
    }
  })).filter(item => item.incidents > 0).slice(0, 10) || [];
  return (
    <div className="mx-6">
      <div className="h-21" />
      <div className="m-4">
        <h1 className="text-3xl font-semibold text-blue-500">Command Center</h1>
        <p className="text-sm text-gray-400 mt-1">Real-time incident tracking and management</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64 mt-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 mt-12">
          {error}
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && analyticsData && (
        <>
          <RoleBasedTab activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'overview' && (
            <>
              <div className="flex gap-2 mt-12 flex-col md:flex-row">
                <IncidentChart data={chartData} />
                <IncidentCards stats={incidentStats} />
              </div>
            </>
          )}
          {activeTab === "users" && <Users />}
          {activeTab === "incidents" && <AllIncidents />}
          {activeTab === 'analytics' && (
            <>
              {detailedAnalytics ? (
                <>
                  <div className="flex gap-2 mt-12">
                    <IncidentChart data={incidentTrendData} />
                    <SystemMetrics data={systemMetricsData} />
                  </div>
                  <TypeOfCrime data={categoryData} />
                  <ResponseTimeGraph data={responseTimeData} />
                  <IncidentHotspots hotspots={hotspotData} />
                </>
              ) : (
                <div className="flex items-center justify-center h-64 mt-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              )}
            </>
          )}
          {activeTab === 'team' && (
            <div className="">
              <AssignCase />
            </div>
          )}
          {activeTab === 'activity' && <ActivityLog />}
        </>
      )}
    </div>
  );
}

export default DashboardAdmin;