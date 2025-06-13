
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center items-center gap-3 mb-6">
              <Building2 className="h-10 w-10 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Workshop Management
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Professional event management platform for corporate workshops and team collaboration
            </p>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Events</h2>
            <p className="text-gray-600">Select an event to participate or manage administrative settings</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-gray-900">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-lg">{event.name}</span>
                  </CardTitle>
                  {event.description && (
                    <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleEventSelect(event)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Join Event
                    </Button>
                    
                    <Button
                      onClick={() => handleAdminAccess(event)}
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Events Available</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Get started by creating your first corporate event or workshop.
                </p>
                <Button 
                  onClick={() => navigate('/admin')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3"
                >
                  Create First Event
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-500 text-sm">
            <Building2 className="h-4 w-4 inline mr-2" />
            Professional Workshop Management Platform
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSelector;
