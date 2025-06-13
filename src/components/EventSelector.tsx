
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Settings, Building2 } from 'lucide-react';
import { useEvent } from "@/contexts/EventContext";
import { useNavigate } from 'react-router-dom';

const EventSelector = () => {
  const { events, currentEvent, setCurrentEvent, loading } = useEvent();
  const navigate = useNavigate();

  const handleEventSelect = (event: any) => {
    setCurrentEvent(event);
    navigate(`/event/${event.slug}/dashboard`);
  };

  const handleAdminAccess = (event: any) => {
    setCurrentEvent(event);
    navigate(`/event/${event.slug}/admin`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E6F3FF' }}>
        {/* Logo */}
        <div className="absolute top-4 right-4 z-10">
          <img 
            src="/ChatGPT Image 13 juin 2025, 15_24_09.png" 
            alt="Logo" 
            className="h-48 w-auto"
          />
        </div>

        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E6F3FF' }}>
      {/* Logo */}
      <div className="absolute top-4 right-4 z-10">
        <img 
          src="/ChatGPT Image 13 juin 2025, 15_24_09.png" 
          alt="Logo" 
          className="h-48 w-auto"
        />
      </div>

      {/* Page Title */}
      <div className="container mx-auto px-6 pt-20 pb-8">
        <h1 className="text-5xl font-bold text-slate-900 text-center">Events</h1>
      </div>

      {/* Events Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-slate-900">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-lg">{event.name}</span>
                  </CardTitle>
                  {event.description && (
                    <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </CardHeader>
                
                <CardContent className="pt-2">
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleEventSelect(event)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Join Workshop
                    </Button>
                    
                    <Button
                      onClick={() => handleAdminAccess(event)}
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-2.5 transition-all duration-200"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Manage Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-16 max-w-lg mx-auto">
                <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-8">
                  <Building2 className="h-16 w-16 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">No Events Available</h3>
                <p className="text-slate-600 mb-10 leading-relaxed text-lg">
                  Get started by creating your first corporate event or workshop.
                </p>
                <Button 
                  onClick={() => navigate('/admin')} 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-8 py-3 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Create First Event
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200 mt-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-slate-500 text-sm">
            <Building2 className="h-4 w-4 inline mr-2" />
            Professional Workshop Management Platform
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSelector;
