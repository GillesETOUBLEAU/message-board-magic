import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Edit, Trash2, Eye, Copy, Settings } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEvent } from "@/contexts/EventContext";
import { useNavigate } from 'react-router-dom';
import AccessCodeManager from './AccessCodeManager';

const EventManager = () => {
  const { events, loadEvents, currentEvent } = useEvent();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error("Name and slug are required");
      return;
    }

    const slug = formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    // Always generate access code since all events are now code_protected
    const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    if (editingEvent) {
      const updateData: any = {
        name: formData.name,
        description: formData.description,
        slug: slug,
        access_mode: 'code_protected'
      };
      
      // Only update access_code if no code exists
      if (!editingEvent.access_code) {
        updateData.access_code = accessCode;
      }
      
      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', editingEvent.id);
      
      if (error) {
        toast.error("Failed to update event");
        return;
      }
      
      toast.success("Event updated successfully");
      setEditingEvent(null);
    } else {
      const { error } = await supabase
        .from('events')
        .insert({
          name: formData.name,
          description: formData.description,
          slug: slug,
          access_mode: 'code_protected',
          access_code: accessCode,
          is_active: true
        });
      
      if (error) {
        if (error.code === '23505') {
          toast.error("Event slug already exists");
        } else {
          toast.error("Failed to create event");
        }
        return;
      }
      
      toast.success(`Event created successfully! Access code: ${accessCode}`);
      setShowCreateForm(false);
    }
    
    setFormData({ name: '', description: '', slug: '' });
    loadEvents();
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description || '',
      slug: event.slug
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event? This will also delete all associated messages and data.")) {
      return;
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    
    if (error) {
      toast.error("Failed to delete event");
      return;
    }
    
    toast.success("Event deleted successfully");
    loadEvents();
  };

  const openProjection = (event: any) => {
    window.open(`/event/${event.slug}/projection`, '_blank');
  };

  const copyAccessCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Access code copied to clipboard!");
  };

  const handleManageEvent = (event: any) => {
    navigate(`/event/${event.slug}/admin`);
  };

  // Get default expanded items (currently managing event)
  const defaultExpanded = currentEvent ? [currentEvent.id] : [];

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl">Event Management</span>
          <Button
            onClick={() => {
              setShowCreateForm(true);
              setEditingEvent(null);
              setFormData({ name: '', description: '', slug: '' });
            }}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {showCreateForm && (
          <Card className="border-2 border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-blue-800">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Event Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white"
                />
                <Input
                  placeholder="Event Slug (URL-friendly identifier)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="bg-white"
                />
                <Textarea
                  placeholder="Event Description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="bg-white"
                />
                <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> All events require an access code. A unique code will be generated automatically.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="px-6">
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingEvent(null);
                    }}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Accordion type="multiple" defaultValue={defaultExpanded} className="space-y-4">
          {events.map((event) => {
            const isCurrentlyManaged = currentEvent?.id === event.id;
            
            return (
              <AccordionItem 
                key={event.id} 
                value={event.id}
                className={`border rounded-lg transition-all duration-200 ${
                  isCurrentlyManaged 
                    ? 'border-2 border-blue-400 bg-blue-50/50 shadow-md' 
                    : 'border border-gray-200 hover:shadow-sm'
                }`}
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full mr-4">
                    <div className="flex items-center gap-4">
                      <h3 className="font-semibold text-lg text-gray-800">{event.name}</h3>
                      <div className="flex gap-2">
                        <Badge variant={event.is_active ? "default" : "secondary"} className="px-2 py-1 text-xs">
                          {event.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="destructive" className="px-2 py-1 text-xs">
                          Code Protected
                        </Badge>
                        {isCurrentlyManaged && (
                          <Badge className="bg-blue-600 hover:bg-blue-700 px-2 py-1 text-xs">
                            Currently Managing
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-5 pt-2">
                    {/* Event Details */}
                    {event.description && (
                      <p className="text-gray-600 leading-relaxed">{event.description}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Slug:</span> {event.slug}
                    </p>

                    {/* Access Code Section */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-700">Access Code:</span>
                          <code className="bg-white px-4 py-2 rounded border font-mono text-sm font-semibold tracking-wider">
                            {event.access_code}
                          </code>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyAccessCode(event.access_code)}
                          className="gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-wrap pt-2">
                      {!isCurrentlyManaged && (
                        <Button
                          size="sm"
                          onClick={() => handleManageEvent(event)}
                          className="bg-blue-600 hover:bg-blue-700 gap-2 px-4 py-2"
                        >
                          <Settings className="h-4 w-4" />
                          Manage
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openProjection(event)}
                        className="gap-2 px-4 py-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(event)}
                        className="gap-2 px-4 py-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(event.id)}
                        className="gap-2 px-4 py-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                    
                    <AccessCodeManager event={event} onCodeUpdated={loadEvents} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default EventManager;
