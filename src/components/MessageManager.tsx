
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Trash2, Download } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEvent } from "@/contexts/EventContext";

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

  const downloadCSV = () => {
    const approvedMessages = messages.filter(m => m.status === 'approved');
    
    if (approvedMessages.length === 0) {
      toast.error("No approved messages to download");
      return;
    }

    const csvHeader = 'Name,Email,Message,Date\n';
    const csvData = approvedMessages.map(message => {
      const escapedContent = `"${message.content.replace(/"/g, '""')}"`;
      const escapedName = `"${message.author_name.replace(/"/g, '""')}"`;
      const date = new Date(message.created_at).toLocaleDateString();
      return `${escapedName},${message.author_email},${escapedContent},${date}`;
    }).join('\n');

    const csvContent = csvHeader + csvData;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `approved_messages_${currentEvent?.slug}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV file downloaded successfully!");
  };

  const downloadXLSX = () => {
    const approvedMessages = messages.filter(m => m.status === 'approved');
    
    if (approvedMessages.length === 0) {
      toast.error("No approved messages to download");
      return;
    }

    const header = 'Name\tEmail\tMessage\tDate\n';
    const data = approvedMessages.map(message => {
      const date = new Date(message.created_at).toLocaleDateString();
      return `${message.author_name}\t${message.author_email}\t${message.content}\t${date}`;
    }).join('\n');

    const content = header + data;
    const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `approved_messages_${currentEvent?.slug}_${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("XLSX file downloaded successfully!");
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
          <CardTitle className="flex items-center justify-between">
            <span>Approved Messages ({approvedMessages.length})</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={downloadCSV}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button
                size="sm"
                onClick={downloadXLSX}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                XLSX
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {approvedMessages.map((message) => (
              <div key={message.id} className="p-3 bg-green-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.author_name} • {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMessage(message.id)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageManager;
