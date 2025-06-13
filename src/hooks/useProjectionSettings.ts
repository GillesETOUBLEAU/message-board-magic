
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEvent } from "@/contexts/EventContext";

interface ProjectionSettings {
  id?: string;
  event_id: string;
  title: string;
  background_color: string;
  font_size: number;
  sticky_note_colors: string[];
}

export const useProjectionSettings = () => {
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
      console.log('useProjectionSettings: Loading settings for event:', currentEvent.name, 'ID:', currentEvent.id);
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
      console.log('useProjectionSettings: Found existing settings:', data);
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
      console.log('useProjectionSettings: No existing settings, using defaults for event:', currentEvent.name);
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

    console.log('useProjectionSettings: Saving settings:', settingsData);

    let error;
    
    if (settings.id) {
      const result = await supabase
        .from('projection_settings')
        .update(settingsData)
        .eq('id', settings.id);
      error = result.error;
      console.log('useProjectionSettings: Updated existing settings, error:', error);
    } else {
      const result = await supabase
        .from('projection_settings')
        .insert([settingsData])
        .select()
        .single();
      
      if (!result.error && result.data) {
        setSettings(prev => ({ ...prev, id: result.data.id }));
        console.log('useProjectionSettings: Created new settings with ID:', result.data.id);
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

  return {
    settings,
    setSettings,
    isLoading,
    saveSettings,
    currentEvent
  };
};
