
import React from 'react';

interface MessageWithColor {
  id: string;
  content: string;
  author_name: string;
  color: string;
}

interface StickyNotesGridProps {
  displayedMessages: MessageWithColor[];
  fontSize: number;
}

const StickyNotesGrid = ({ displayedMessages, fontSize }: StickyNotesGridProps) => {
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

  return (
    <div className="absolute inset-0 pt-40">
      {displayedMessages.map((message, index) => {
        const position = getGridPosition(index);
        
        return (
          <div
            key={message.id}
            className="absolute w-64 h-40 p-4 shadow-lg transition-all duration-1000 ease-out"
            style={{
              ...position,
              backgroundColor: message.color,
              fontSize: `${fontSize}px`,
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
  );
};

export default StickyNotesGrid;
