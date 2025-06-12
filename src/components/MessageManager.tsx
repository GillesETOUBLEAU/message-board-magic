
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  author_name: string;
  author_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const MessageManager = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading messages:', error);
      return;
    }
    
    setMessages(data || []);
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

  const pendingMessages = messages.filter(m => m.status === 'pending');
  const approvedMessages = messages.filter(m => m.status === 'approved');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pending Messages ({pendingMessages.length})</span>
            <Badge variant="secondary">{pendingMessages.length} to review</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {pendingMessages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No pending messages
              </p>
            ) : (
              pendingMessages.map((message) => (
                <div key={message.id} className="p-4 border rounded-lg bg-yellow-50">
                  <p className="text-sm mb-2">{message.content}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <p>From: {message.author_name}</p>
                      <p>{new Date(message.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateMessageStatus(message.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateMessageStatus(message.id, 'rejected')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approved Messages ({approvedMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {approvedMessages.map((message) => (
              <div key={message.id} className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {message.author_name} • {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageManager;
