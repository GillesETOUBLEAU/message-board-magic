
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MessageFormProps {
  user: { name: string; email: string };
  onMessageSent: () => void;
}

const MessageForm = ({ user, onMessageSent }: MessageFormProps) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (newMessage.length > 200) {
      toast.error("Message too long! Keep it under 200 characters.");
      return;
    }

    const { error } = await supabase
      .from('messages')
      .insert({
        content: newMessage,
        author_name: user.name,
        author_email: user.email,
        status: 'pending'
      });

    if (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
      return;
    }

    onMessageSent();
    setNewMessage('');
    toast.success("Message sent for review!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send Message
        </CardTitle>
        <p className="text-sm text-gray-600">Share your thoughts (max 200 characters)</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            maxLength={200}
            rows={3}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {newMessage.length}/200 characters
            </span>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MessageForm;
