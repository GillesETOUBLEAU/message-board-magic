
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminAccessCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
      <CardHeader className="text-center pb-3 pt-4">
        <CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2 justify-center">
          <div className="p-1.5 bg-purple-50 rounded-md">
            <Shield className="h-4 w-4 text-purple-600" />
          </div>
          Admin Access
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/events')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 text-sm shadow-sm hover:shadow-md transition-all duration-200"
            size="sm"
          >
            <Settings className="mr-2 h-3 w-3" />
            Admin Dashboard
          </Button>
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs text-slate-400">
            Admin credentials required
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminAccessCard;
