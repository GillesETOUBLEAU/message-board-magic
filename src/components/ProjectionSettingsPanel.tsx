
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from 'lucide-react';
import { useProjectionSettings } from "@/hooks/useProjectionSettings";
import ProjectionSettingsForm from './ProjectionSettingsForm';

const ProjectionSettingsPanel = () => {
  const { settings, setSettings, isLoading, saveSettings, currentEvent } = useProjectionSettings();

  if (!currentEvent) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">Please select an event first</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Projection Settings
        </CardTitle>
        <p className="text-sm text-gray-600">Settings for: {currentEvent.name}</p>
      </CardHeader>
      <CardContent>
        <ProjectionSettingsForm
          settings={settings}
          onSettingsChange={setSettings}
          onSave={saveSettings}
          isLoading={isLoading}
          eventName={currentEvent.name}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectionSettingsPanel;
