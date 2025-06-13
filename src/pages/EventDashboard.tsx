import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useEvent } from "@/contexts/EventContext";
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
  event_id: string;
}

const EventDashboard = () => {
  const { eventSlug } = useParams();
  const navigate = useNavigate();
  const { events, setCurrentEvent, currentEvent, loading } = useEvent();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('workshop-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    if (!loading && events.length > 0 && eventSlug) {
      const event = events.find(e => e.slug === eventSlug);
      if (event) {
        setCurrentEvent(event);
      } else {
        navigate('/');
      }
    }
  }, [events, eventSlug, loading, setCurrentEvent, navigate]);

  useEffect(() => {
    if (user && currentEvent) {
      loadUserMessages(user.email);
    }
  }, [user, currentEvent]);

  const loadUserMessages = async (userEmail: string) => {
    if (!currentEvent) return;
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('author_email', userEmail)
      .eq('event_id', currentEvent.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading messages:', error);
      return;
    }
    
    setMessages(data || []);
  };

  const handleAuth = (userData: { name: string; email: string }) => {
    setUser(userData);
    localStorage.setItem('workshop-user', JSON.stringify(userData));
    if (currentEvent) {
      loadUserMessages(userData.email);
    }
  };

  const handleMessageSent = () => {
    if (user && currentEvent) {
      loadUserMessages(user.email);
    }
  };

  const logout = () => {
    localStorage.removeItem('workshop-user');
    setUser(null);
    setMessages([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E6F3FF' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E6F3FF' }}>
        <div className="text-center">
          <p className="text-gray-600 mb-4">Event not found</p>
          <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E6F3FF' }}>
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader 
          userName={user.name} 
          onLogout={logout} 
          eventName={currentEvent.name}
        />
        <div className="grid md:grid-cols-2 gap-8">
          <MessageForm user={user} onMessageSent={handleMessageSent} />
          <MessagesList messages={messages} />
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
