
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEvent } from "@/contexts/EventContext";

interface ProjectionSettings {
  id?: string;
  event_id: string;
  title: string;
  background_color: string;
  font_size: number;
  sticky_note_colors: string[];
}

const ProjectionSettingsPanel = () => {
  const { currentEvent } = useEvent();
  const [settings, setSettings] = useState<ProjectionSettings>({
    event_id: '',
    title: 'Workshop Ideas Board',
    background_color: '#ffffff',
    font_size: 18,
    sticky_note_colors: ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fed7d7']
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentEvent) {
      loadSettings();
    }
  }, [currentEvent]);

  const loadSettings = async () => {
    if (!currentEvent) return;

    const { data, error } = await supabase
      .from('projection_settings')
      .select('*')
      .eq('event_id', currentEvent.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error loading settings:', error);
      return;
    }
    
    if (data) {
      setSettings({
        id: data.id,
        event_id: data.event_id,
        title: data.title || `${currentEvent.name} - Ideas Board`,
        background_color: data.background_color || '#ffffff',
        font_size: data.font_size || 18,
        sticky_note_colors: Array.isArray(data.sticky_note_colors) 
          ? data.sticky_note_colors as string[]
          : ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fed7d7']
      });
    } else {
      // Set default values for new event
      setSettings({
        event_id: currentEvent.id,
        title: `${currentEvent.name} - Ideas Board`,
        background_color: '#ffffff',
        font_size: 18,
        sticky_note_colors: ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fed7d7']
      });
    }
  };

  const saveSettings = async () => {
    if (!currentEvent) return;
    
    setIsLoading(true);
    
    const settingsData = {
      event_id: currentEvent.id,
      title: settings.title,
      background_color: settings.background_color,
      font_size: settings.font_size,
      sticky_note_colors: settings.sticky_note_colors
    };

    let error;
    
    if (settings.id) {
      // Update existing settings
      const result = await supabase
        .from('projection_settings')
        .update(settingsData)
        .eq('id', settings.id);
      error = result.error;
    } else {
      // Insert new settings
      const result = await supabase
        .from('projection_settings')
        .insert([settingsData])
        .select()
        .single();
      
      if (!result.error && result.data) {
        setSettings(prev => ({ ...prev, id: result.data.id }));
      }
      error = result.error;
    }
    
    setIsLoading(false);
    
    if (error) {
      console.error('Error saving settings:', error);
      toast.error("Failed to save settings");
      return;
    }
    
    toast.success("Settings saved!");
  };

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
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Title</label>
          <Input
            type="text"
            value={settings.title}
            onChange={(e) => setSettings({...settings, title: e.target.value})}
            placeholder={`${currentEvent.name} - Ideas Board`}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Background Color</label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={settings.background_color}
              onChange={(e) => setSettings({...settings, background_color: e.target.value})}
              className="w-16 h-10"
            />
            <Input
              type="text"
              value={settings.background_color}
              onChange={(e) => setSettings({...settings, background_color: e.target.value})}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Font Size</label>
          <Input
            type="number"
            min="12"
            max="32"
            value={settings.font_size}
            onChange={(e) => setSettings({...settings, font_size: parseInt(e.target.value)})}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Sticky Note Colors</label>
          <div className="grid grid-cols-5 gap-2">
            {settings.sticky_note_colors.map((color, index) => (
              <Input
                key={index}
                type="color"
                value={color}
                onChange={(e) => {
                  const newColors = [...settings.sticky_note_colors];
                  newColors[index] = e.target.value;
                  setSettings({...settings, sticky_note_colors: newColors});
                }}
                className="w-12 h-12 p-1"
              />
            ))}
          </div>
        </div>

        <Button 
          onClick={saveSettings} 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectionSettingsPanel;
