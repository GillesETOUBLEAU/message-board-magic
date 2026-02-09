
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEvent } from "@/contexts/EventContext";
import PendingMessagesCard from './PendingMessagesCard';
import ApprovedMessagesCard from './ApprovedMessagesCard';

interface Message {
  id: string;
  content: string;
  author_name: string;
  author_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  event_id: string;
}

const MessageManager = () => {
  const { currentEvent } = useEvent();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (currentEvent) {
      loadMessages();
    }
  }, [currentEvent]);

  const loadMessages = async () => {
    if (!currentEvent) return;
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('event_id', currentEvent.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading messages:', error);
      return;
    }
    
    setMessages((data || []) as Message[]);
  };

  const updateMessageStatus = async (messageId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('messages')
      .update({ status })
      .eq('id', messageId);
    
    if (error) {
      toast.error("Failed to update message status");
      return;
    }
    
    loadMessages();
    toast.success(`Message ${status}!`);
  };

  const deleteMessage = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);
    
    if (error) {
      toast.error("Failed to delete message");
      return;
    }
    
    loadMessages();
    toast.success("Message deleted successfully!");
  };

  if (!currentEvent) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No event selected</p>
        </CardContent>
      </Card>
    );
  }

  const pendingMessages = messages.filter(m => m.status === 'pending');
  const approvedMessages = messages.filter(m => m.status === 'approved');

  return (
    <div className="space-y-6">
      <PendingMessagesCard
        messages={pendingMessages}
        onApprove={(messageId) => updateMessageStatus(messageId, 'approved')}
        onReject={(messageId) => updateMessageStatus(messageId, 'rejected')}
      />
      <ApprovedMessagesCard
        messages={approvedMessages}
        eventSlug={currentEvent.slug}
        onDelete={deleteMessage}
      />
    </div>
  );
};

export default MessageManager;
