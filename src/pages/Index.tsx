
import React from 'react';
import { Building2, Settings } from 'lucide-react';
import AccessCodeForm from '@/components/AccessCodeForm';
import AdminAccessCard from '@/components/AdminAccessCard';

const Index = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E6F3FF' }}>
      {/* Header Section */}
      <div className="w-full">
        <img 
          src="/Header2.png" 
          alt="Header" 
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section for Participants */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Join Your Workshop
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Enter your access code to participate in an interactive workshop experience
            </p>
          </div>

          {/* Main Access Form - Centered */}
          <div className="flex justify-center mb-16">
            <div className="w-full max-w-md">
              <AccessCodeForm />
            </div>
          </div>

          {/* Secondary Admin Access - Smaller and Less Prominent */}
          <div className="border-t border-slate-200 pt-12">
            <div className="flex flex-col items-center">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-slate-700 mb-2 flex items-center justify-center gap-2">
                  <Settings className="h-5 w-5" />
                  Event Organizer?
                </h3>
                <p className="text-sm text-slate-500">
                  Access admin dashboard to manage workshops
                </p>
              </div>
              <div className="w-full max-w-xs">
                <AdminAccessCard />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200 mt-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-slate-500 text-sm">
            <Building2 className="h-4 w-4 inline mr-2" />
            Professional Workshop Management Platform
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
