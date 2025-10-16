import { useState } from 'react';
import RoleBasedTab from "../../RoleBasedTab";
import VictimOverview from './VictimOverview';
import MyIncidents from './MyIncidents';
import CaseStatus from './CaseStatus';
import Support from './Support';

function DashboardUser() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <VictimOverview />;
      case 'incidents':
        return <MyIncidents />;
      case 'status':
        return <CaseStatus />;
      case 'support':
        return <Support />;
      default:
        return <VictimOverview />;
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

export default DashboardUser;