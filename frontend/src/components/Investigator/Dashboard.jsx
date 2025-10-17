import { useState } from 'react';
import RoleBasedTab from "../../components/RoleBasedTab";
import InvestigatorOverview from './InvestigatorOverview';
import MyCases from './MyCases';
import ActivityLog from './ActivityLog';
import Evidence from './Evidence';
import Reports from './Reports';

function DashboardInvestigator() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <InvestigatorOverview />;
      case 'assigned':
        return <MyCases />;
      case 'activity':
        return <ActivityLog />;
      case 'evidence':
        return <Evidence />;
      case 'reports':
        return <Reports />;
      default:
        return <InvestigatorOverview />;
    }
  };

  return (
    <>
      <div className="mb-4 mt-2 px-4">
        <div className="h-24"/>
        <RoleBasedTab activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="px-4">
        {renderContent()}
      </div>
    </>
  );
}

export default DashboardInvestigator;