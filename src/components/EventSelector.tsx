
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Settings, StickyNote } from 'lucide-react';
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

  const stickyNoteColors = [
    'bg-yellow-200 border-yellow-300 shadow-yellow-100',
    'bg-pink-200 border-pink-300 shadow-pink-100',
    'bg-blue-200 border-blue-300 shadow-blue-100',
    'bg-green-200 border-green-300 shadow-green-100',
    'bg-purple-200 border-purple-300 shadow-purple-100',
    'bg-orange-200 border-orange-300 shadow-orange-100',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-700 text-lg">Loading your workshops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-pink-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-20 w-24 h-24 bg-blue-300 rounded-full opacity-20 animate-pulse delay-2000"></div>
      <div className="absolute bottom-20 right-32 w-18 h-18 bg-purple-300 rounded-full opacity-20 animate-pulse delay-500"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-6">
            <StickyNote className="h-12 w-12 text-yellow-500 transform rotate-12" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Workshop Hub
            </h1>
            <StickyNote className="h-10 w-10 text-pink-500 transform -rotate-12" />
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Welcome to your creative workspace! Choose an event to join the conversation and share your ideas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {events.map((event, index) => {
            const colorClass = stickyNoteColors[index % stickyNoteColors.length];
            const rotation = `rotate-${[-2, -1, 0, 1, 2][index % 5]}`;
            
            return (
              <div
                key={event.id}
                className={`transform ${rotation} hover:rotate-0 transition-all duration-300 hover:scale-105`}
              >
                <Card className={`${colorClass} border-2 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
                  {/* Sticky note tape effect */}
                  <div className="absolute top-0 right-4 w-8 h-6 bg-gray-400 opacity-50 rounded-b-sm"></div>
                  
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <Calendar className="h-6 w-6 text-gray-700" />
                      <span className="font-bold text-lg">{event.name}</span>
                    </CardTitle>
                    {event.description && (
                      <p className="text-gray-700 text-sm mt-2 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <Button
                      onClick={() => handleEventSelect(event)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Users className="mr-2 h-5 w-5" />
                      Join Workshop
                    </Button>
                    
                    <Button
                      onClick={() => handleAdminAccess(event)}
                      variant="outline"
                      className="w-full border-2 border-gray-600 text-gray-700 hover:bg-gray-700 hover:text-white font-semibold transition-all duration-200"
                    >
                      <Settings className="mr-2 h-5 w-5" />
                      Manage Event
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto border-2 border-dashed border-gray-300">
              <StickyNote className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Events Yet!</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Ready to create your first workshop? Let's get started!
              </p>
              <Button 
                onClick={() => navigate('/admin')} 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Create Your First Event
              </Button>
            </div>
          </div>
        )}

        {/* Fun footer section */}
        <div className="text-center mt-20 pb-8">
          <div className="flex justify-center items-center gap-2 text-gray-600">
            <StickyNote className="h-5 w-5 text-yellow-500" />
            <span className="text-sm">Made with creativity and collaboration in mind</span>
            <StickyNote className="h-5 w-5 text-pink-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSelector;
