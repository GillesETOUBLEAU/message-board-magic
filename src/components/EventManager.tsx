import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Event Management</span>
          <Button
            onClick={() => {
              setShowCreateForm(true);
              setEditingEvent(null);
              setFormData({ name: '', description: '', slug: '' });
            }}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Event Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    placeholder="Event Slug (URL-friendly identifier)"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Event Description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> All events require an access code. A unique code will be generated automatically.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingEvent(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {events.map((event) => {
            const isCurrentlyManaged = currentEvent?.id === event.id;
            
            return (
              <div 
                key={event.id} 
                className={`border rounded-lg p-6 ${isCurrentlyManaged ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 mr-6">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="font-semibold text-lg">{event.name}</h3>
                        <Badge variant={event.is_active ? "default" : "secondary"}>
                          {event.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="destructive">
                          Code Protected
                        </Badge>
                        {isCurrentlyManaged && (
                          <Badge className="bg-blue-600">
                            Currently Managing
                          </Badge>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      )}
                      <p className="text-sm text-gray-500 mb-3">Slug: {event.slug}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">Access Code:</span>
                        <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                          {event.access_code}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyAccessCode(event.access_code)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {!isCurrentlyManaged && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleManageEvent(event)}
                          className="bg-blue-600 hover:bg-blue-700 min-w-[100px]"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openProjection(event)}
                        className="min-w-[80px]"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(event)}
                        className="min-w-[70px]"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(event.id)}
                        className="min-w-[80px]"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <AccessCodeManager event={event} onCodeUpdated={loadEvents} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventManager;
