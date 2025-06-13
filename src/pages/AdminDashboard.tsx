
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AdminAuthForm from "@/components/AdminAuthForm";
import MessageManager from "@/components/MessageManager";
import ProjectionSettingsPanel from "@/components/ProjectionSettingsPanel";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

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
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  if (!user || !isAdmin) {
    return <AdminAuthForm />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E6F3FF' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Logo positioned in upper right corner */}
        <div className="absolute top-6 right-6 z-10">
          <img 
            src="/ChatGPT Image 13 juin 2025, 15_24_09.png" 
            alt="Logo" 
            className="h-48 w-auto"
            onError={(e) => {
              console.error('Logo failed to load:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Header with proper spacing from logo */}
        <div className="flex justify-between items-start mb-6 mt-16">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Manage workshop messages and settings</p>
          </div>
          <div className="flex gap-4 mt-16">
            <Button 
              onClick={() => window.open('/projection', '_blank')}
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
          <ProjectionSettingsPanel />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
