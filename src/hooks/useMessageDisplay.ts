
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
  const [displayedMessageIds, setDisplayedMessageIds] = useState<Set<string>>(new Set());

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
    // Find new messages that haven't been displayed yet
    const newMessages = messages.filter(message => !displayedMessageIds.has(message.id));
    
    if (newMessages.length > 0) {
      // Add new messages one by one with animation timing
      let messageIndex = 0;
      
      const addNextMessage = () => {
        if (messageIndex < newMessages.length) {
          const newMessage = newMessages[messageIndex];
          const assignedColor = getDistributedColor(displayedMessages.length + messageIndex);
          
          setDisplayedMessages(prev => [
            ...prev,
            { ...newMessage, color: assignedColor }
          ]);
          
          setDisplayedMessageIds(prev => new Set([...prev, newMessage.id]));
          
          messageIndex++;
          
          if (messageIndex < newMessages.length) {
            setTimeout(addNextMessage, 1000);
          }
        }
      };
      
      // Start adding messages with a delay
      setTimeout(addNextMessage, 1000);
    }
  }, [messages, displayedMessageIds, displayedMessages.length, settings.sticky_note_colors, settings.background_color]);

  return { displayedMessages };
};
