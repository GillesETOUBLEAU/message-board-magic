
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import AuthForm from '@/components/AuthForm';
import DashboardHeader from '@/components/DashboardHeader';
import MessageForm from '@/components/MessageForm';
import MessagesList from '@/components/MessagesList';

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
    
    setMessages((data || []) as Message[]);
  };

  const handleAuth = (userData: { name: string; email: string }) => {
    setUser(userData);
    localStorage.setItem('workshop-user', JSON.stringify(userData));
    loadUserMessages(userData.email);
  };

  const handleMessageSent = () => {
    if (user) {
      loadUserMessages(user.email);
    }
  };

  const logout = () => {
    localStorage.removeItem('workshop-user');
    setUser(null);
    setMessages([]);
  };

  if (!user) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E6F3FF' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Logo and Logout positioned separately */}
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-4">
          <img 
            src="/ChatGPT Image 13 juin 2025, 15_24_09.png" 
            alt="Logo" 
            className="h-48 w-auto"
            onError={(e) => {
              console.error('Logo failed to load:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
          <DashboardHeader userName={user.name} onLogout={logout} showOnlyLogout={true} />
        </div>

        <DashboardHeader userName={user.name} onLogout={logout} showOnlyTitle={true} />
        <div className="grid md:grid-cols-2 gap-8">
          <MessageForm user={user} onMessageSent={handleMessageSent} />
          <MessagesList messages={messages} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
