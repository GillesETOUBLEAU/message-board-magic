import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Settings, Shield, Palette } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  content: string;
  author_name: string;
  author_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface ProjectionSettings {
  id: string;
  background_color: string;
  font_size: number;
  sticky_note_colors: string[];
}

const AdminDashboard = () => {
  const { user, session } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<ProjectionSettings>({
    id: '',
    background_color: '#ffffff',
    font_size: 18,
    sticky_note_colors: ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fed7d7']
  });

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profile?.role === 'admin') {
      setIsAdmin(true);
      loadMessages();
      loadSettings();
    } else {
      toast.error("Access denied. Admin role required.");
    }
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading messages:', error);
      return;
    }
    
    setMessages(data || []);
  };

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from('projection_settings')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error loading settings:', error);
      return;
    }
    
    if (data) {
      // Convert Json type to string[] for sticky_note_colors
      setSettings({
        ...data,
        sticky_note_colors: Array.isArray(data.sticky_note_colors) 
          ? data.sticky_note_colors as string[]
          : ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fed7d7']
      });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email to confirm your account!");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
      }
    }
  };

  const updateMessageStatus = async (messageId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('messages')
      .update({ status })
      .eq('id', messageId);
    
    if (error) {
      toast.error("Failed to update message status");
      return;
    }
    
    loadMessages();
    toast.success(`Message ${status}!`);
  };

  const saveSettings = async () => {
    const { error } = await supabase
      .from('projection_settings')
      .update({
        background_color: settings.background_color,
        font_size: settings.font_size,
        sticky_note_colors: settings.sticky_note_colors
      })
      .eq('id', settings.id);
    
    if (error) {
      toast.error("Failed to save settings");
      return;
    }
    
    toast.success("Settings saved!");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2 justify-center">
              <Shield className="h-6 w-6" />
              Admin {isSignUp ? 'Sign Up' : 'Login'}
            </CardTitle>
            <p className="text-gray-600">
              {isSignUp ? 'Create admin account' : 'Enter your credentials'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <Input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                {isSignUp ? 'Sign Up' : 'Login'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-purple-600 hover:text-purple-700 text-sm"
              >
                {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign up'}
              </button>
            </div>
            {isSignUp && (
              <p className="text-xs text-gray-500 mt-4 text-center">
                Note: You'll need to manually set your role to 'admin' in the database after signup.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingMessages = messages.filter(m => m.status === 'pending');
  const approvedMessages = messages.filter(m => m.status === 'approved');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Manage workshop messages and settings</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => window.open('/projection', '_blank')}
              className="bg-green-600 hover:bg-green-700"
            >
              Open Projection
            </Button>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pending Messages ({pendingMessages.length})</span>
                  <Badge variant="secondary">{pendingMessages.length} to review</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pendingMessages.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No pending messages
                    </p>
                  ) : (
                    pendingMessages.map((message) => (
                      <div key={message.id} className="p-4 border rounded-lg bg-yellow-50">
                        <p className="text-sm mb-2">{message.content}</p>
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-500">
                            <p>From: {message.author_name}</p>
                            <p>{new Date(message.created_at).toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateMessageStatus(message.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateMessageStatus(message.id, 'rejected')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approved Messages ({approvedMessages.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {approvedMessages.map((message) => (
                    <div key={message.id} className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.author_name} • {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Projection Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Background Color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.background_color}
                    onChange={(e) => setSettings({...settings, background_color: e.target.value})}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={settings.background_color}
                    onChange={(e) => setSettings({...settings, background_color: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Font Size</label>
                <Input
                  type="number"
                  min="12"
                  max="32"
                  value={settings.font_size}
                  onChange={(e) => setSettings({...settings, font_size: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sticky Note Colors</label>
                <div className="grid grid-cols-5 gap-2">
                  {settings.sticky_note_colors.map((color, index) => (
                    <Input
                      key={index}
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const newColors = [...settings.sticky_note_colors];
                        newColors[index] = e.target.value;
                        setSettings({...settings, sticky_note_colors: newColors});
                      }}
                      className="w-12 h-12 p-1"
                    />
                  ))}
                </div>
              </div>

              <Button onClick={saveSettings} className="w-full bg-blue-600 hover:bg-blue-700">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
