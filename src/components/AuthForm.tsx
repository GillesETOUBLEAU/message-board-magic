
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEvent } from "@/contexts/EventContext";

interface AuthFormProps {
  onAuth: (userData: { name: string; email: string }) => void;
}

const AuthForm = ({ onAuth }: AuthFormProps) => {
  const { currentEvent } = useEvent();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const userData = { name, email };
    
    // Store user in workshop_users table with event_id if available
    if (currentEvent) {
      const { error } = await supabase
        .from('workshop_users')
        .upsert({ 
          name, 
          email, 
          event_id: currentEvent.id 
        }, { onConflict: 'email' });
      
      if (error) {
        console.error('Error storing user:', error);
      }
    }
    
    onAuth(userData);
    toast.success("Welcome to the workshop!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Join Workshop
          </CardTitle>
          <p className="text-gray-600">
            {currentEvent ? `Enter your details to participate in "${currentEvent.name}"` : 'Enter your details to participate'}
          </p>
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
};

export default AuthForm;
