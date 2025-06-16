
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEvent } from "@/contexts/EventContext";
import { useProjectionData } from "@/hooks/useProjectionData";
import { useMessageDisplay } from "@/hooks/useMessageDisplay";
import ProjectionHeader from "@/components/ProjectionHeader";
import StickyNotesGrid from "@/components/StickyNotesGrid";
import ProjectionFooter from "@/components/ProjectionFooter";
import ProjectionLogo from "@/components/ProjectionLogo";
import ProjectionLoadingState from "@/components/ProjectionLoadingState";

const EventProjection = () => {
  const { eventSlug } = useParams();
  const { events, setCurrentEvent, currentEvent, loading } = useEvent();
  
  const { messages, settings } = useProjectionData(currentEvent);
  const { displayedMessages } = useMessageDisplay(messages, settings);

  useEffect(() => {
    if (!loading && events.length > 0 && eventSlug) {
      const event = events.find(e => e.slug === eventSlug);
      if (event) {
        setCurrentEvent(event);
      }
    }
  }, [events, eventSlug, loading, setCurrentEvent]);

  if (loading) {
    return <ProjectionLoadingState message="Loading event..." />;
  }

  if (!currentEvent) {
    return <ProjectionLoadingState message="Event not found. The requested event could not be found." />;
  }

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative"
      style={{ 
        backgroundColor: settings.background_color,
        aspectRatio: '16/9'
      }}
    >
      <ProjectionLogo />
      
      <ProjectionHeader 
        currentEvent={currentEvent}
        title={settings.title}
        messageCount={displayedMessages.length}
      />

      <StickyNotesGrid 
        displayedMessages={displayedMessages}
        fontSize={settings.font_size}
      />

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

export default EventProjection;
