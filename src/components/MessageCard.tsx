
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  author_name: string;
  author_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  event_id: string;
}

interface MessageCardProps {
  message: Message;
  type: 'pending' | 'approved';
  onApprove?: (messageId: string) => void;
  onReject?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
}

const MessageCard = ({ message, type, onApprove, onReject, onDelete }: MessageCardProps) => {
  const bgColor = type === 'pending' ? 'bg-yellow-50' : 'bg-green-50';

  return (
    <div className={`p-4 border rounded-lg ${bgColor}`}>
      <p className="text-sm mb-2">{message.content}</p>
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          <p>From: {message.author_name}</p>
          <p>{new Date(message.created_at).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          {type === 'pending' && (
            <>
              <Button
                size="sm"
                onClick={() => onApprove?.(message.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject?.(message.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          {type === 'approved' && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete?.(message.id)}
              className="ml-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
