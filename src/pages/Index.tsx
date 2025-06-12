
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Monitor, MessageSquare, Palette, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Workshop Animation Tool
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your workshops with interactive sticky note animations. 
            Collect ideas from participants and display them beautifully on any screen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                <Users className="mr-2 h-5 w-5" />
                Join as Participant
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline" className="px-8 py-3">
                <Shield className="mr-2 h-5 w-5" />
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Three Powerful Views
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Participant View</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Simple authentication with email and name. Submit ideas with one-sentence limit and track your message history.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Quick Login</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Message History</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Real-time Status</span>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Admin Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Moderate all messages, customize projection settings, and control the workshop experience with full admin powers.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Message Moderation</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Style Control</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Live Management</span>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Monitor className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Projection Display</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Beautiful 16:9 whiteboard with animated sticky notes. Perfect for presentations and engaging workshop visuals.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">16:9 Format</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Live Animation</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Colorful Notes</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Key Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Messages</h3>
              <p className="text-sm text-gray-600">Instant submission and approval workflow</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="font-semibold mb-2">Customizable Design</h3>
              <p className="text-sm text-gray-600">Adjust colors, fonts, and layout</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold mb-2">Smooth Animations</h3>
              <p className="text-sm text-gray-600">Engaging transitions and effects</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Monitor className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Projection Ready</h3>
              <p className="text-sm text-gray-600">Optimized for screens and projectors</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Ready to Transform Your Workshop?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start collecting ideas and creating engaging presentations in minutes.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
