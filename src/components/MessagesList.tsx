
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  author_name: string;
  author_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface MessagesListProps {
  messages: Message[];
}

const MessagesList = ({ messages }: MessagesListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Your Messages ({messages.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No messages yet. Send your first message!
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg border-l-4 ${
                  message.status === 'approved'
                    ? 'bg-green-50 border-l-green-500'
                    : message.status === 'rejected'
                    ? 'bg-red-50 border-l-red-500'
                    : 'bg-yellow-50 border-l-yellow-500'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      message.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : message.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {message.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagesList;
