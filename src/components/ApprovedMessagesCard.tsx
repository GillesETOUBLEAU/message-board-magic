
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
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
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="p-4 bg-green-50 border rounded-lg">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 mb-2 break-words">{message.content}</p>
                  <p className="text-xs text-gray-500">
                    {message.author_name} • {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(message.id)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovedMessagesCard;
