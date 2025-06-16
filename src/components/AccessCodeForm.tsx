
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Lock } from 'lucide-react';
import { toast } from "sonner";
import { useEvent } from "@/contexts/EventContext";
import { useNavigate } from 'react-router-dom';

const AccessCodeForm = () => {
  const [accessCode, setAccessCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { findEventByAccessCode, setCurrentEvent } = useEvent();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode.trim()) {
      toast.error("Please enter an access code");
      return;
    }
    
    setIsValidating(true);
    
    try {
      const event = await findEventByAccessCode(accessCode);
      
      if (event) {
        setCurrentEvent(event);
        navigate(`/event/${event.slug}/dashboard?code=${accessCode}`);
        toast.success(`Welcome to ${event.name}!`);
      } else {
        toast.error("Invalid access code. Please check and try again.");
      }
    } catch (error) {
      console.error('Error validating access code:', error);
      toast.error("Error validating access code. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-xl border-0">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3 justify-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Enter access code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              className="pl-10 text-center font-mono text-lg tracking-wider"
              maxLength={6}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 shadow-md hover:shadow-lg transition-all duration-200"
            disabled={isValidating}
          >
            {isValidating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Validating...
              </div>
            ) : (
              "Join Workshop"
            )}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            Access code provided by your workshop organizer
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessCodeForm;
