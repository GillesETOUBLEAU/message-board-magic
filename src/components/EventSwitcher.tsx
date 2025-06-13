
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  is_active: boolean;
  access_code: string;
  access_mode: 'code_protected';
  created_at: string;
  updated_at: string;
}

interface EventSwitcherProps {
  currentEvent: Event;
  events: Event[];
  onEventSwitch: (event: Event) => void;
}

const EventSwitcher = ({ currentEvent, events, onEventSwitch }: EventSwitcherProps) => {
  const otherEvents = events.filter(event => event.id !== currentEvent.id);

  if (otherEvents.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Switch Event</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {otherEvents.map((event) => (
            <Button
              key={event.id}
              onClick={() => onEventSwitch(event)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <span>{event.name}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventSwitcher;
