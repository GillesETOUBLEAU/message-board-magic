
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Settings } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Select Workshop Event
          </h1>
          <p className="text-xl text-gray-600">
            Choose an event to participate in or manage
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  {event.name}
                </CardTitle>
                {event.description && (
                  <p className="text-sm text-gray-600">{event.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleEventSelect(event)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Join as Participant
                </Button>
                <Button
                  onClick={() => handleAdminAccess(event)}
                  variant="outline"
                  className="w-full"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Access
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No active events found</p>
            <Button onClick={() => navigate('/admin')} variant="outline">
              Create Your First Event
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSelector;
