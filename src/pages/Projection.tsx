
import React, { useState, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
}

interface ProjectionSettings {
  backgroundColor: string;
  fontSize: number;
  stickyNoteColors: string[];
}

const Projection = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<ProjectionSettings>({
    backgroundColor: '#ffffff',
    fontSize: 18,
    stickyNoteColors: ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fed7d7']
  });
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);

  useEffect(() => {
    const loadData = () => {
      const savedMessages = localStorage.getItem('workshop-messages');
      const savedSettings = localStorage.getItem('workshop-settings');
      
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        const approved = parsedMessages.filter((msg: Message) => msg.status === 'approved');
        setMessages(approved);
      }
      
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    };

    loadData();
    const interval = setInterval(loadData, 2000); // Poll every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animate in new messages one by one
    if (messages.length > displayedMessages.length) {
      const timer = setTimeout(() => {
        setDisplayedMessages(prev => [
          ...prev,
          messages[prev.length]
        ]);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [messages, displayedMessages]);

  const getRandomColor = () => {
    return settings.stickyNoteColors[Math.floor(Math.random() * settings.stickyNoteColors.length)];
  };

  const getRandomPosition = (index: number) => {
    // Create a grid-like distribution with some randomness
    const cols = 4;
    const rows = Math.ceil(displayedMessages.length / cols);
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    const baseX = (col * 25) + 10; // Base grid position
    const baseY = (row * 20) + 15;
    
    // Add some randomness
    const randomX = baseX + (Math.random() - 0.5) * 10;
    const randomY = baseY + (Math.random() - 0.5) * 8;
    
    return {
      left: `${Math.max(5, Math.min(85, randomX))}%`,
      top: `${Math.max(10, Math.min(80, randomY))}%`,
    };
  };

  const getRandomRotation = () => {
    return Math.random() * 20 - 10; // -10 to +10 degrees
  };

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative"
      style={{ 
        backgroundColor: settings.backgroundColor,
        aspectRatio: '16/9'
      }}
    >
      {/* Header */}
      <div className="absolute top-8 left-8 right-8 text-center z-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Workshop Ideas Board
        </h1>
        <p className="text-xl text-gray-600">
          {displayedMessages.length} contributions from our community
        </p>
      </div>

      {/* Sticky Notes */}
      <div className="absolute inset-0 pt-32">
        {displayedMessages.map((message, index) => {
          const position = getRandomPosition(index);
          const rotation = getRandomRotation();
          const color = getRandomColor();
          
          return (
            <div
              key={message.id}
              className="absolute w-64 h-40 p-4 shadow-lg transition-all duration-1000 ease-out animate-in slide-in-from-bottom-4 fade-in"
              style={{
                ...position,
                backgroundColor: color,
                transform: `rotate(${rotation}deg)`,
                fontSize: `${settings.fontSize}px`,
                animation: `slideIn 0.8s ease-out ${index * 0.5}s both`
              }}
            >
              <div className="h-full flex flex-col justify-between">
                <p className="text-gray-800 font-medium leading-tight overflow-hidden">
                  {message.content}
                </p>
                <div className="text-xs text-gray-600 opacity-75">
                  - {message.author.split('@')[0]}
                </div>
              </div>
              
              {/* Sticky note effect */}
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-6 opacity-30"
                style={{ backgroundColor: '#f59e0b' }}
              />
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

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.8) rotate(${getRandomRotation()}deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(${getRandomRotation()}deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Projection;
