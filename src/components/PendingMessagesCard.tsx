
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MessageCard from './MessageCard';

interface Message {
  id: string;
  content: string;
  author_name: string;
  author_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  event_id: string;
}

interface PendingMessagesCardProps {
  messages: Message[];
  onApprove: (messageId: string) => void;
  onReject: (messageId: string) => void;
}

const PendingMessagesCard = ({ messages, onApprove, onReject }: PendingMessagesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Pending Messages ({messages.length})</span>
          <Badge variant="secondary">{messages.length} to review</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No pending messages
            </p>
          ) : (
            messages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                type="pending"
                onApprove={onApprove}
                onReject={onReject}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingMessagesCard;
