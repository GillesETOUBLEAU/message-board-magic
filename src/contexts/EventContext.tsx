
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  is_active: boolean;
  access_code: string; // Now always required
  access_mode: 'code_protected'; // All events are now code_protected
  created_at: string;
  updated_at: string;
}

interface EventContextType {
  currentEvent: Event | null;
  setCurrentEvent: (event: Event | null) => void;
  events: Event[];
  loadEvents: () => Promise<void>;
  loading: boolean;
  findEventByAccessCode: (code: string) => Promise<Event | null>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading events:', error);
    } else {
      // All events are now code_protected by default
      const typedEvents: Event[] = (data || []).map(event => ({
        ...event,
        access_mode: 'code_protected' as const
      }));
      
      setEvents(typedEvents);
    }
    setLoading(false);
  };

  const findEventByAccessCode = async (code: string): Promise<Event | null> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('access_code', code.toUpperCase())
      .eq('is_active', true)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return {
      ...data,
      access_mode: 'code_protected' as const
    };
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <EventContext.Provider value={{
      currentEvent,
      setCurrentEvent,
      events,
      loadEvents,
      loading,
      findEventByAccessCode
    }}>
      {children}
    </EventContext.Provider>
  );
};
