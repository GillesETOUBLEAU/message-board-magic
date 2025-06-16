
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  author_name: string;
  author_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  event_id: string;
}

interface ProjectionSettings {
  title: string;
  background_color: string;
  font_size: number;
  sticky_note_colors: string[];
}

interface Event {
  id: string;
  name: string;
  access_code: string;
  slug: string;
}

export const useProjectionData = (currentEvent: Event | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<ProjectionSettings>({
    title: 'Workshop Ideas Board',
    background_color: '#ffffff',
    font_size: 18,
    sticky_note_colors: ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fed7d7']
  });

  useEffect(() => {
    if (currentEvent) {
      console.log('useProjectionData: Loading data for event:', currentEvent.name, 'ID:', currentEvent.id);
      
      const loadData = async () => {
        // Load approved messages from Supabase for this event - order by created_at ASC for proper display order
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('event_id', currentEvent.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: true });
        
        if (messagesError) {
          console.error('Error loading messages:', messagesError);
        } else {
          console.log('useProjectionData: Loaded messages:', messagesData?.length || 0);
          setMessages(messagesData || []);
        }

        // Load projection settings from Supabase for this event
        const { data: settingsData, error: settingsError } = await supabase
          .from('projection_settings')
          .select('*')
          .eq('event_id', currentEvent.id)
          .maybeSingle();
        
        if (settingsError) {
          console.error('Error loading settings:', settingsError);
        } else if (settingsData) {
          console.log('useProjectionData: Loaded settings:', settingsData);
          setSettings({
            title: settingsData.title || `${currentEvent.name} - Ideas Board`,
            background_color: settingsData.background_color || '#ffffff',
            font_size: settingsData.font_size || 18,
            sticky_note_colors: Array.isArray(settingsData.sticky_note_colors) 
              ? settingsData.sticky_note_colors as string[]
              : ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fed7d7']
          });
        } else {
          console.log('useProjectionData: No settings found, using defaults for event:', currentEvent.name);
          // Use event name in default title if no settings found
          setSettings(prev => ({
            ...prev,
            title: `${currentEvent.name} - Ideas Board`
          }));
        }
      };

      loadData();
      const interval = setInterval(loadData, 3000); // Poll every 3 seconds to catch setting changes
      
      return () => clearInterval(interval);
    }
  }, [currentEvent]);

  return { messages, settings };
};
