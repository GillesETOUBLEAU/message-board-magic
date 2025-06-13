
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEvent } from "@/contexts/EventContext";

const EventManager = () => {
  const { events, loadEvents } = useEvent();
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
    
    if (editingEvent) {
      const { error } = await supabase
        .from('events')
        .update({
          name: formData.name,
          description: formData.description,
          slug: slug
        })
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

        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{event.name}</h3>
                    <Badge variant={event.is_active ? "default" : "secondary"}>
                      {event.is_active ? "Active" : "Inactive"}
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventManager;
