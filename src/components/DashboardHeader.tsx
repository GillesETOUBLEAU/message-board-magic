
import React from 'react';
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName: string;
  onLogout: () => void;
  eventName?: string;
  showOnlyLogout?: boolean;
  showOnlyTitle?: boolean;
}

const DashboardHeader = ({ userName, onLogout, eventName, showOnlyLogout, showOnlyTitle }: DashboardHeaderProps) => {
  if (showOnlyLogout) {
    return (
      <Button onClick={onLogout} variant="outline">
        Logout
      </Button>
    );
  }

  if (showOnlyTitle) {
    return (
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {eventName ? `${eventName} - Messages` : 'Workshop Messages'}
        </h1>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          {eventName ? `${eventName} - Messages` : 'Workshop Messages'}
        </h1>
        <p className="text-gray-600">Welcome back, {userName}!</p>
      </div>
      <Button onClick={onLogout} variant="outline">
        Logout
      </Button>
    </div>
  );
};

export default DashboardHeader;
