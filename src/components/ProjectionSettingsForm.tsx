
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ColorPicker from './ColorPicker';
import StickyNoteColorGrid from './StickyNoteColorGrid';

interface ProjectionSettings {
  id?: string;
  event_id: string;
  title: string;
  background_color: string;
  font_size: number;
  sticky_note_colors: string[];
}

interface ProjectionSettingsFormProps {
  settings: ProjectionSettings;
  onSettingsChange: (settings: ProjectionSettings) => void;
  onSave: () => void;
  isLoading: boolean;
  eventName: string;
}

const ProjectionSettingsForm = ({ 
  settings, 
  onSettingsChange, 
  onSave, 
  isLoading, 
  eventName 
}: ProjectionSettingsFormProps) => {
  const updateSettings = (field: keyof ProjectionSettings, value: any) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...settings.sticky_note_colors];
    newColors[index] = color;
    updateSettings('sticky_note_colors', newColors);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Title</label>
        <Input
          type="text"
          value={settings.title}
          onChange={(e) => updateSettings('title', e.target.value)}
          placeholder={`${eventName} - Ideas Board`}
        />
      </div>

      <ColorPicker
        label="Background Color"
        value={settings.background_color}
        onChange={(value) => updateSettings('background_color', value)}
        showTextInput={true}
      />

      <div>
        <label className="text-sm font-medium mb-2 block">Font Size</label>
        <Input
          type="number"
          min="12"
          max="32"
          value={settings.font_size}
          onChange={(e) => updateSettings('font_size', parseInt(e.target.value))}
        />
      </div>

      <StickyNoteColorGrid
        colors={settings.sticky_note_colors}
        onColorChange={handleColorChange}
      />

      <Button 
        onClick={onSave} 
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
};

export default ProjectionSettingsForm;
