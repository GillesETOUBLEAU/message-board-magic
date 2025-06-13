import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useEvent } from "@/contexts/EventContext";

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

interface MessageWithColor extends Message {
  color: string;
}

const EventProjection = () => {
  const { eventSlug } = useParams();
  const { events, setCurrentEvent, currentEvent, loading } = useEvent();
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<ProjectionSettings>({
    title: 'Workshop Ideas Board',
    background_color: '#ffffff',
    font_size: 18,
    sticky_note_colors: ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fed7d7']
  });
  const [displayedMessages, setDisplayedMessages] = useState<MessageWithColor[]>([]);

  useEffect(() => {
    if (!loading && events.length > 0 && eventSlug) {
      const event = events.find(e => e.slug === eventSlug);
      if (event) {
        setCurrentEvent(event);
      }
    }
  }, [events, eventSlug, loading, setCurrentEvent]);

  useEffect(() => {
    if (currentEvent) {
      console.log('EventProjection: Loading data for event:', currentEvent.name, 'ID:', currentEvent.id);
      
      const loadData = async () => {
        // Load approved messages from Supabase for this event
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('event_id', currentEvent.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });
        
        if (messagesError) {
          console.error('Error loading messages:', messagesError);
        } else {
          console.log('EventProjection: Loaded messages:', messagesData?.length || 0);
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
          console.log('EventProjection: Loaded settings:', settingsData);
          setSettings({
            title: settingsData.title || `${currentEvent.name} - Ideas Board`,
            background_color: settingsData.background_color || '#ffffff',
            font_size: settingsData.font_size || 18,
            sticky_note_colors: Array.isArray(settingsData.sticky_note_colors) 
              ? settingsData.sticky_note_colors as string[]
              : ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fed7d7']
          });
        } else {
          console.log('EventProjection: No settings found, using defaults for event:', currentEvent.name);
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

  useEffect(() => {
    if (messages.length > displayedMessages.length) {
      const timer = setTimeout(() => {
        const newMessage = messages[displayedMessages.length];
        const assignedColor = getDistributedColor(displayedMessages.length);
        
        setDisplayedMessages(prev => [
          ...prev,
          { ...newMessage, color: assignedColor }
        ]);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [messages, displayedMessages]);

  const getDistributedColor = (index: number) => {
    const availableColors = settings.sticky_note_colors.filter(color => 
      color.toLowerCase() !== settings.background_color.toLowerCase()
    );
    
    if (availableColors.length === 0) {
      return '#fef3c7';
    }
    
    return availableColors[index % availableColors.length];
  };

  const getGridPosition = (index: number) => {
    const totalMessages = displayedMessages.length;
    const cols = Math.ceil(Math.sqrt(totalMessages * 1.5));
    const rows = Math.ceil(totalMessages / cols);
    
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    const gridWidth = cols * 280;
    const gridHeight = rows * 180;
    
    const startX = (100 - (gridWidth / window.innerWidth * 100)) / 2;
    const startY = (100 - (gridHeight / window.innerHeight * 100)) / 2;
    
    const x = startX + (col * 280 / window.innerWidth * 100);
    const y = startY + (row * 180 / window.innerHeight * 100);
    
    return {
      left: `${Math.max(2, Math.min(95, x))}%`,
      top: `${Math.max(15, Math.min(85, y))}%`,
    };
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        {/* Logo */}
        <div className="absolute top-4 right-4 z-10">
          <img 
            src="/ChatGPT Image 13 juin 2025, 15_24_09.png" 
            alt="Logo" 
            className="h-12 w-auto"
            onError={(e) => {
              console.error('Logo failed to load:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        {/* Logo */}
        <div className="absolute top-4 right-4 z-10">
          <img 
            src="/ChatGPT Image 13 juin 2025, 15_24_09.png" 
            alt="Logo" 
            className="h-12 w-auto"
            onError={(e) => {
              console.error('Logo failed to load:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h1>
          <p className="text-gray-600">The requested event could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative"
      style={{ 
        backgroundColor: settings.background_color,
        aspectRatio: '16/9'
      }}
    >
      {/* Logo */}
      <div className="absolute top-4 right-4 z-20">
        <img 
          src="/ChatGPT Image 13 juin 2025, 15_24_09.png" 
          alt="Logo" 
          className="h-12 w-auto"
          onError={(e) => {
            console.error('Logo failed to load:', e);
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Header */}
      <div className="absolute top-8 left-8 right-8 text-center z-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {settings.title}
        </h1>
        <p className="text-xl text-gray-600">
          {displayedMessages.length} contributions from our community
        </p>
      </div>

      {/* Sticky Notes */}
      <div className="absolute inset-0 pt-32">
        {displayedMessages.map((message, index) => {
          const position = getGridPosition(index);
          
          return (
            <div
              key={message.id}
              className="absolute w-64 h-40 p-4 shadow-lg transition-all duration-1000 ease-out"
              style={{
                ...position,
                backgroundColor: message.color,
                fontSize: `${settings.font_size}px`,
                animation: `slideIn 0.8s ease-out ${index * 0.5}s both`
              }}
            >
              <div className="h-full flex flex-col justify-between">
                <p className="text-gray-800 font-medium leading-tight overflow-hidden">
                  {message.content.length > 160 ? `${message.content.substring(0, 160)}...` : message.content}
                </p>
                <div className="text-xs text-gray-600 opacity-75">
                  - {message.author_name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-8 right-8 text-center">
        <p className="text-lg text-gray-600">
          Keep the ideas coming! 💡
        </p>
      </div>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(50px) scale(0.8);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default EventProjection;
