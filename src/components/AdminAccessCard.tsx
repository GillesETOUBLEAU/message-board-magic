
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminAccessCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="w-full bg-white/60 backdrop-blur-sm shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <CardHeader className="text-center pb-3 pt-4">
        <CardTitle className="text-base font-medium text-slate-500 flex items-center gap-2 justify-center">
          <div className="p-1.5 bg-slate-50 rounded-md">
            <Shield className="h-4 w-4 text-slate-400" />
          </div>
          Access Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/events')}
            className="w-full bg-slate-500 hover:bg-slate-600 text-white font-normal py-2 text-sm shadow-sm hover:shadow-md transition-all duration-200"
            size="sm"
          >
            <Settings className="mr-2 h-3 w-3" />
            Dashboard
          </Button>
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs text-slate-400">
            Credentials required
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminAccessCard;
