
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useMessageDisplay } from "@/hooks/useMessageDisplay";
import ProjectionLogo from "@/components/ProjectionLogo";
import ProjectionFooter from "@/components/ProjectionFooter";

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

const Projection = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<ProjectionSettings>({
    title: 'Workshop Ideas Board',
    background_color: '#E6F3FF',
    font_size: 18,
    sticky_note_colors: ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fed7d7']
  });

  const { displayedMessages } = useMessageDisplay(messages, settings);

  useEffect(() => {
    const loadData = async () => {
      // Load approved messages from Supabase - order by created_at ASC for proper display order
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: true });
      
      if (messagesError) {
        console.error('Error loading messages:', messagesError);
      } else {
        setMessages(messagesData || []);
      }

      // Load projection settings from Supabase
      const { data: settingsData, error: settingsError } = await supabase
        .from('projection_settings')
        .select('*')
        .single();
      
      if (settingsError) {
        console.error('Error loading settings:', settingsError);
      } else if (settingsData) {
        setSettings({
          title: settingsData.title || 'Workshop Ideas Board',
          background_color: settingsData.background_color || '#E6F3FF',
          font_size: settingsData.font_size || 18,
          sticky_note_colors: Array.isArray(settingsData.sticky_note_colors) 
            ? settingsData.sticky_note_colors as string[]
            : ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fed7d7']
        });
      }
    };

    loadData();
    const interval = setInterval(loadData, 2000); // Poll every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getGridPosition = (index: number) => {
    // Calculate grid dimensions based on total number of messages
    const totalMessages = displayedMessages.length;
    const cols = Math.ceil(Math.sqrt(totalMessages * 1.5)); // Slightly wider than square
    const rows = Math.ceil(totalMessages / cols);
    
    // Calculate position in grid
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    // Center the grid on the screen
    const gridWidth = cols * 280; // 280px per column (card width + margin)
    const gridHeight = rows * 180; // 180px per row (card height + margin)
    
    const startX = (100 - (gridWidth / window.innerWidth * 100)) / 2;
    const startY = (100 - (gridHeight / window.innerHeight * 100)) / 2;
    
    const x = startX + (col * 280 / window.innerWidth * 100);
    const y = startY + (row * 180 / window.innerHeight * 100);
    
    return {
      left: `${Math.max(2, Math.min(95, x))}%`,
      top: `${Math.max(15, Math.min(85, y))}%`,
    };
  };

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative"
      style={{ 
        backgroundColor: settings.background_color,
        aspectRatio: '16/9'
      }}
    >
      <ProjectionLogo />

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

      <ProjectionFooter />

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

export default Projection;
