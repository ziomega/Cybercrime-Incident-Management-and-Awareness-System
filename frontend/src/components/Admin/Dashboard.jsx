import RoleBasedTab from "../../RoleBasedTab";
import IncidentChart from "../IncidentChart";
import ResponseTimeGraph from "./ResponseTimeGraph";
import { useState } from "react";
import IncidentCards from "./IncidentCards";
import IncidentHotspots from "./IncidentHotspots";
import SystemMetrics from "../SystemMetrics";
import TypeOfCrime from "./TypeOfCrime";
import AllIncidents from "./AllIncidents";
import Users from "./Users";
import AssignCase from "./AssignCase";

function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <div className="mx-6">
      <div className="h-21" />
      <div className="m-4">
        <h1 className="text-3xl font-semibold text-blue-500">Command Center</h1>
      <p className="text-sm text-gray-400 mt-1">Real-time incident tracking and management</p>
      </div>
      <RoleBasedTab activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'overview' && (
        <>
      <div className="flex gap-2 mt-12 flex-col md:flex-row">
        
        <IncidentChart />
        <IncidentCards />
      </div>
      </>
      )}
      {
        activeTab==="users" && <Users />
      }
      {
        activeTab==="incidents" && <AllIncidents />
      }
      {activeTab === 'analytics' && (
        <>
      <div className="flex gap-2 mt-12">
        
        <IncidentChart />
        <SystemMetrics />
      </div>
      <TypeOfCrime />
      <ResponseTimeGraph />
      <IncidentHotspots />
        </>
        )}
      {activeTab === 'team' && (
        <div className="">
          <AssignCase/>
        </div>
      )}
    </div>
  );
}

export default DashboardAdmin;