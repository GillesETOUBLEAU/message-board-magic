
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProjectionSettings {
  id: string;
  background_color: string;
  font_size: number;
  sticky_note_colors: string[];
}

const ProjectionSettingsPanel = () => {
  const [settings, setSettings] = useState<ProjectionSettings>({
    id: '',
    background_color: '#ffffff',
    font_size: 18,
    sticky_note_colors: ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fed7d7']
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from('projection_settings')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error loading settings:', error);
      return;
    }
    
    if (data) {
      // Convert Json type to string[] for sticky_note_colors
      setSettings({
        ...data,
        sticky_note_colors: Array.isArray(data.sticky_note_colors) 
          ? data.sticky_note_colors as string[]
          : ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fed7d7']
      });
    }
  };

  const saveSettings = async () => {
    const { error } = await supabase
      .from('projection_settings')
      .update({
        background_color: settings.background_color,
        font_size: settings.font_size,
        sticky_note_colors: settings.sticky_note_colors
      })
      .eq('id', settings.id);
    
    if (error) {
      toast.error("Failed to save settings");
      return;
    }
    
    toast.success("Settings saved!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Projection Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <Button onClick={saveSettings} className="w-full bg-blue-600 hover:bg-blue-700">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectionSettingsPanel;
