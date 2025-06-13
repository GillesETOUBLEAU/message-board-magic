
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminAccessCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-xl border-0">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3 justify-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          Admin Access
        </CardTitle>
        <p className="text-slate-600 mt-3">
          Manage events and workshop settings
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/events')}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Settings className="mr-2 h-4 w-4" />
            Admin Login
          </Button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            Requires admin credentials to access
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminAccessCard;
