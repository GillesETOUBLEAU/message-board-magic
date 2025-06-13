
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEvent } from "@/contexts/EventContext";
import AdminAuthForm from "@/components/AdminAuthForm";
import MessageManager from "@/components/MessageManager";
import ProjectionSettingsPanel from "@/components/ProjectionSettingsPanel";
import EventManager from "@/components/EventManager";

const EventAdmin = () => {
  const { eventSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, setCurrentEvent, currentEvent, loading } = useEvent();
  const [isAdmin, setIsAdmin] = useState(false);

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
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profile?.role === 'admin') {
      setIsAdmin(true);
    } else {
      toast.error("Access denied. Admin role required.");
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      navigate('/');
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E6F3FF' }}>
        {/* Logo positioned at very top */}
        <div className="absolute top-0 right-2 z-50">
          <img 
            src="/ChatGPT Image 13 juin 2025, 15_24_09.png" 
            alt="Logo" 
            className="h-32 w-auto"
            onError={(e) => {
              console.error('Logo failed to load:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminAuthForm />;
  }

  if (!currentEvent) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#E6F3FF' }}>
        <div className="container mx-auto px-4 py-8">
          {/* Logo positioned at very top */}
          <div className="absolute top-0 right-2 z-50">
            <img 
              src="/ChatGPT Image 13 juin 2025, 15_24_09.png" 
              alt="Logo" 
              className="h-32 w-auto"
              onError={(e) => {
                console.error('Logo failed to load:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Header with proper spacing from logo */}
          <div className="flex justify-between items-start mb-6 pt-16">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600">Manage events and settings</p>
            </div>
            <div className="flex items-center">
              <Button onClick={logout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
          <EventManager />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E6F3FF' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Logo positioned at very top */}
        <div className="absolute top-0 right-2 z-50">
          <img 
            src="/ChatGPT Image 13 juin 2025, 15_24_09.png" 
            alt="Logo" 
            className="h-32 w-auto"
            onError={(e) => {
              console.error('Logo failed to load:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Header with proper spacing from logo */}
        <div className="flex justify-between items-start mb-6 pt-16">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Managing: {currentEvent.name}</p>
          </div>
          <div className="flex gap-4 items-center">
            <Button 
              onClick={() => window.open(`/event/${currentEvent.slug}/projection`, '_blank')}
              className="bg-green-600 hover:bg-green-700"
            >
              Open Projection
            </Button>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MessageManager />
          </div>
          <div className="space-y-6">
            <ProjectionSettingsPanel />
            <EventManager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAdmin;
