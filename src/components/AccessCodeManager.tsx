
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, QrCode, Eye, EyeOff } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import QRCodeDisplay from './QRCodeDisplay';

interface AccessCodeManagerProps {
  event: any;
  onCodeUpdated: () => void;
}

const AccessCodeManager = ({ event, onCodeUpdated }: AccessCodeManagerProps) => {
  const [showQR, setShowQR] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const generateNewCode = async () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { error } = await supabase
      .from('events')
      .update({ access_code: newCode })
      .eq('id', event.id);
    
    if (error) {
      toast.error("Failed to generate new access code");
      return;
    }
    
    toast.success("New access code generated successfully");
    onCodeUpdated();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(event.access_code);
    toast.success("Access code copied to clipboard");
  };

  const copyJoinUrl = () => {
    const joinUrl = `${window.location.origin}/event/${event.slug}/dashboard?code=${event.access_code}`;
    navigator.clipboard.writeText(joinUrl);
    toast.success("Join URL copied to clipboard");
  };

  const joinUrl = `${window.location.origin}/event/${event.slug}/dashboard?code=${event.access_code}`;

  return (
    <Card className="mt-3 bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          Access Code Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              type={showCode ? "text" : "password"}
              value={event.access_code || ''}
              readOnly
              className="font-mono text-center bg-white"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCode(!showCode)}
          >
            {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={copyCode}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={generateNewCode}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={copyJoinUrl}
            className="flex-1"
          >
            Copy Join URL
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowQR(!showQR)}
          >
            <QrCode className="h-4 w-4 mr-1" />
            {showQR ? 'Hide' : 'Show'} QR Code
          </Button>
        </div>

        {showQR && (
          <QRCodeDisplay
            url={joinUrl}
            eventName={event.name}
            accessCode={event.access_code}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AccessCodeManager;
