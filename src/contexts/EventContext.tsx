
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  is_active: boolean;
  access_code: string | null;
  access_mode: 'open' | 'code_protected';
  created_at: string;
  updated_at: string;
}

interface EventContextType {
  currentEvent: Event | null;
  setCurrentEvent: (event: Event | null) => void;
  events: Event[];
  loadEvents: () => Promise<void>;
  loading: boolean;
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
      // Type cast the data to ensure access_mode matches our union type
      const typedEvents: Event[] = (data || []).map(event => ({
        ...event,
        access_mode: (event.access_mode || 'open') as 'open' | 'code_protected'
      }));
      
      setEvents(typedEvents);
      
      // Set default event if none is selected
      if (!currentEvent && typedEvents && typedEvents.length > 0) {
        const defaultEvent = typedEvents.find(e => e.slug === 'default') || typedEvents[0];
        setCurrentEvent(defaultEvent);
      }
    }
    setLoading(false);
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
      loading
    }}>
      {children}
    </EventContext.Provider>
  );
};
