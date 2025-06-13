
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MessageCard from './MessageCard';
import ExportButtons from './ExportButtons';

interface Message {
  id: string;
  content: string;
  author_name: string;
  author_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  event_id: string;
}

interface ApprovedMessagesCardProps {
  messages: Message[];
  eventSlug?: string;
  onDelete: (messageId: string) => void;
}

const ApprovedMessagesCard = ({ messages, eventSlug, onDelete }: ApprovedMessagesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Approved Messages ({messages.length})</span>
          <ExportButtons messages={messages} eventSlug={eventSlug} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.author_name} • {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <MessageCard
                  message={message}
                  type="approved"
                  onDelete={onDelete}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovedMessagesCard;
