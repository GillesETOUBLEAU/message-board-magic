import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEvent } from "@/contexts/EventContext";
import { useSearchParams } from 'react-router-dom';

interface AuthFormProps {
  onAuth: (userData: { name: string; email: string }) => void;
}

const AuthForm = ({ onAuth }: AuthFormProps) => {
  const { currentEvent } = useEvent();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState(searchParams.get('code') || '');
  const [isValidatingCode, setIsValidatingCode] = useState(false);

  const needsAccessCode = currentEvent?.access_mode === 'code_protected';

  const validateAccessCode = async (code: string): Promise<boolean> => {
    if (!currentEvent || !needsAccessCode || !code.trim()) return false;
    
    setIsValidatingCode(true);
    
    try {
      // Check if the access code matches
      const isValid = currentEvent.access_code === code.trim().toUpperCase();
      
      // Log the access attempt
      await supabase
        .from('event_access_attempts')
        .insert({
          event_id: currentEvent.id,
          attempted_code: code.trim(),
          user_email: email || null,
          user_name: name || null,
          success: isValid
        });
      
      return isValid;
    } catch (error) {
      console.error('Error validating access code:', error);
      return false;
    } finally {
      setIsValidatingCode(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Validate access code if required
    if (needsAccessCode) {
      const isValidCode = await validateAccessCode(accessCode);
      if (!isValidCode) {
        toast.error("Invalid access code. Please check and try again.");
        return;
      }
    }
    
    const userData = { name, email };
    
    // Store user in workshop_users table with event_id
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
      {/* Logo */}
      <div className="absolute top-4 right-4 z-10">
        <img 
          src="/ChatGPT Image 13 juin 2025, 15_24_09.png" 
          alt="Logo" 
          className="h-12 w-auto"
        />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Join Workshop
          </CardTitle>
          <p className="text-gray-600">
            {currentEvent ? `Enter your details to participate in "${currentEvent.name}"` : 'Enter your details to participate'}
          </p>
          {needsAccessCode && (
            <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded mt-2">
              This workshop requires an access code
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {needsAccessCode && (
              <div>
                <Input
                  type="text"
                  placeholder="Access Code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  className="w-full font-mono text-center"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the access code provided by the workshop organizer
                </p>
              </div>
            )}
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
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isValidatingCode}
            >
              {isValidatingCode ? "Validating..." : "Join Workshop"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
