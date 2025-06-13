
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, Copy, RefreshCw, QrCode } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEvent } from "@/contexts/EventContext";
import AccessCodeManager from './AccessCodeManager';

const EventManager = () => {
  const { events, loadEvents } = useEvent();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    accessMode: 'open' as 'open' | 'code_protected'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error("Name and slug are required");
      return;
    }

    const slug = formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    // Generate access code if code_protected mode is selected
    const accessCode = formData.accessMode === 'code_protected' 
      ? Math.random().toString(36).substring(2, 8).toUpperCase()
      : null;
    
    if (editingEvent) {
      const updateData: any = {
        name: formData.name,
        description: formData.description,
        slug: slug,
        access_mode: formData.accessMode
      };
      
      // Only update access_code if switching to code_protected mode and no code exists
      if (formData.accessMode === 'code_protected' && !editingEvent.access_code) {
        updateData.access_code = accessCode;
      } else if (formData.accessMode === 'open') {
        updateData.access_code = null;
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
          access_mode: formData.accessMode,
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
      
      toast.success("Event created successfully");
      setShowCreateForm(false);
    }
    
    setFormData({ name: '', description: '', slug: '', accessMode: 'open' });
    loadEvents();
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description || '',
      slug: event.slug,
      accessMode: event.access_mode || 'open'
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Event Management</span>
          <Button
            onClick={() => {
              setShowCreateForm(true);
              setEditingEvent(null);
              setFormData({ name: '', description: '', slug: '', accessMode: 'open' });
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
                  <Select
                    value={formData.accessMode}
                    onValueChange={(value: 'open' | 'code_protected') => 
                      setFormData({ ...formData, accessMode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select access mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open Access</SelectItem>
                      <SelectItem value="code_protected">Access Code Required</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.accessMode === 'open' 
                      ? 'Anyone can join this event'
                      : 'Users need an access code to join this event'
                    }
                  </p>
                </div>
                <div>
                  <Textarea
                    placeholder="Event Description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
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

        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{event.name}</h3>
                      <Badge variant={event.is_active ? "default" : "secondary"}>
                        {event.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant={event.access_mode === 'code_protected' ? "destructive" : "outline"}>
                        {event.access_mode === 'code_protected' ? "Code Protected" : "Open Access"}
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    )}
                    <p className="text-xs text-gray-500">Slug: {event.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openProjection(event)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(event)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {event.access_mode === 'code_protected' && (
                  <AccessCodeManager event={event} onCodeUpdated={loadEvents} />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventManager;
