
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Settings, Shield, Palette } from 'lucide-react';
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
}

interface ProjectionSettings {
  backgroundColor: string;
  fontSize: number;
  stickyNoteColors: string[];
}

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<ProjectionSettings>({
    backgroundColor: '#ffffff',
    fontSize: 18,
    stickyNoteColors: ['#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#fed7d7']
  });

  useEffect(() => {
    const savedAdmin = localStorage.getItem('workshop-admin');
    if (savedAdmin === 'true') {
      setIsAdmin(true);
      loadMessages();
      loadSettings();
    }
  }, []);

  const loadMessages = () => {
    const savedMessages = localStorage.getItem('workshop-messages');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(parsedMessages);
    }
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('workshop-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCode === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('workshop-admin', 'true');
      loadMessages();
      loadSettings();
      toast.success("Admin access granted!");
    } else {
      toast.error("Invalid admin code");
    }
  };

  const updateMessageStatus = (messageId: string, status: 'approved' | 'rejected') => {
    const updatedMessages = messages.map(msg =>
      msg.id === messageId ? { ...msg, status } : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem('workshop-messages', JSON.stringify(updatedMessages));
    toast.success(`Message ${status}!`);
  };

  const saveSettings = () => {
    localStorage.setItem('workshop-settings', JSON.stringify(settings));
    toast.success("Settings saved!");
  };

  const logout = () => {
    localStorage.removeItem('workshop-admin');
    setIsAdmin(false);
    setAdminCode('');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2 justify-center">
              <Shield className="h-6 w-6" />
              Admin Access
            </CardTitle>
            <p className="text-gray-600">Enter admin code to continue</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Admin code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="w-full"
              />
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Login as Admin
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Demo code: admin123
            </p>
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
                            <p>From: {message.author}</p>
                            <p>{message.timestamp.toLocaleString()}</p>
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
                        {message.author} • {message.timestamp.toLocaleTimeString()}
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
                    value={settings.backgroundColor}
                    onChange={(e) => setSettings({...settings, backgroundColor: e.target.value})}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={settings.backgroundColor}
                    onChange={(e) => setSettings({...settings, backgroundColor: e.target.value})}
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
                  value={settings.fontSize}
                  onChange={(e) => setSettings({...settings, fontSize: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sticky Note Colors</label>
                <div className="grid grid-cols-5 gap-2">
                  {settings.stickyNoteColors.map((color, index) => (
                    <Input
                      key={index}
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const newColors = [...settings.stickyNoteColors];
                        newColors[index] = e.target.value;
                        setSettings({...settings, stickyNoteColors: newColors});
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
