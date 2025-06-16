
import React, { useRef, useEffect } from 'react';
import QRCode from 'qrcode';

interface Event {
  id: string;
  name: string;
  access_code: string;
  slug: string;
}

interface ProjectionHeaderProps {
  currentEvent: Event;
  title: string;
  messageCount: number;
}

const ProjectionHeader = ({ currentEvent, title, messageCount }: ProjectionHeaderProps) => {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (currentEvent && qrCanvasRef.current) {
      // Generate QR code for the event dashboard
      const eventUrl = `${window.location.origin}/event/${currentEvent.slug}`;
      QRCode.toCanvas(qrCanvasRef.current, eventUrl, {
        width: 120,
        margin: 1,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      }, (error) => {
        if (error) {
          console.error('QR Code generation error:', error);
        }
      });
    }
  }, [currentEvent]);

  return (
    <div className="absolute top-8 left-8 right-8 z-10">
      <div className="flex items-center justify-center gap-8 mb-4">
        {/* QR Code */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-center mb-2">
            <p className="text-sm font-semibold text-gray-700">Join with your phone</p>
            <p className="text-xs text-gray-500">Code: {currentEvent.access_code}</p>
          </div>
          <canvas ref={qrCanvasRef} className="mx-auto" />
        </div>
        
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {title}
          </h1>
          <p className="text-xl text-gray-600">
            {messageCount} contributions from our community
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectionHeader;
