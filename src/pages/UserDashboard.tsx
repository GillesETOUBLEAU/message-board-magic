import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageSquare } from 'lucide-react';
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

const UserDashboard = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('workshop-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      loadUserMessages(userData.email);
    }
  }, []);

  const loadUserMessages = async (userEmail: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('author_email', userEmail)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading messages:', error);
      return;
    }
    
    setMessages(data || []);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const userData = { name, email };
    setUser(userData);
    localStorage.setItem('workshop-user', JSON.stringify(userData));
    
    // Store user in workshop_users table
    const { error } = await supabase
      .from('workshop_users')
      .upsert({ name, email }, { onConflict: 'email' });
    
    if (error) {
      console.error('Error storing user:', error);
    }
    
    loadUserMessages(email);
    toast.success("Welcome to the workshop!");
  };

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
        author_name: user!.name,
        author_email: user!.email,
        status: 'pending'
      });

    if (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
      return;
    }

    loadUserMessages(user!.email);
    setNewMessage('');
    toast.success("Message sent for review!");
  };

  const logout = () => {
    localStorage.removeItem('workshop-user');
    setUser(null);
    setMessages([]);
    setName('');
    setEmail('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Join Workshop
            </CardTitle>
            <p className="text-gray-600">Enter your details to participate</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Join Workshop
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Workshop Messages</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
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
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
