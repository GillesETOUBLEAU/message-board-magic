
import { useState, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  author_name: string;
  author_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  event_id: string;
}

interface MessageWithColor extends Message {
  color: string;
}

interface ProjectionSettings {
  title: string;
  background_color: string;
  font_size: number;
  sticky_note_colors: string[];
}

export const useMessageDisplay = (messages: Message[], settings: ProjectionSettings) => {
  const [displayedMessages, setDisplayedMessages] = useState<MessageWithColor[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const getDistributedColor = (index: number) => {
    const availableColors = settings.sticky_note_colors.filter(color => 
      color.toLowerCase() !== settings.background_color.toLowerCase()
    );
    
    if (availableColors.length === 0) {
      return '#fef3c7';
    }
    
    return availableColors[index % availableColors.length];
  };

  useEffect(() => {
    if (!isInitialized && messages.length > 0) {
      // Initial load: display all existing messages immediately
      const messagesWithColors = messages.map((message, index) => ({
        ...message,
        color: getDistributedColor(index)
      }));
      
      setDisplayedMessages(messagesWithColors);
      setIsInitialized(true);
    } else if (isInitialized) {
      // Handle new messages after initial load
      const currentIds = new Set(displayedMessages.map(m => m.id));
      const newMessages = messages.filter(message => !currentIds.has(message.id));
      
      if (newMessages.length > 0) {
        // Add new messages one by one with animation
        let messageIndex = 0;
        
        const addNextMessage = () => {
          if (messageIndex < newMessages.length) {
            const newMessage = newMessages[messageIndex];
            const totalIndex = displayedMessages.length + messageIndex;
            const assignedColor = getDistributedColor(totalIndex);
            
            setDisplayedMessages(prev => [
              ...prev,
              { ...newMessage, color: assignedColor }
            ]);
            
            messageIndex++;
            
            if (messageIndex < newMessages.length) {
              setTimeout(addNextMessage, 1000);
            }
          }
        };
        
        setTimeout(addNextMessage, 1000);
      }
    }
  }, [messages, isInitialized, settings.sticky_note_colors, settings.background_color]);

  return { displayedMessages };
};
