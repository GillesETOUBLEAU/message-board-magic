
import React from 'react';
import { Building2 } from 'lucide-react';
import AccessCodeForm from '@/components/AccessCodeForm';
import AdminAccessCard from '@/components/AdminAccessCard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 relative">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Left column - Image */}
            <div className="flex justify-center items-center">
              <img 
                src="/LiveStickies.png" 
                alt="Live Stickies Logo" 
                className="h-32 w-auto opacity-90 filter brightness-95 saturate-110"
              />
            </div>
            
            {/* Right column - Text on blue background */}
            <div className="bg-blue-500 rounded-lg p-8 flex flex-col justify-center items-center text-white">
              <img 
                src="/Stickies2.png" 
                alt="Stickies Decoration" 
                className="h-16 w-auto mb-4 opacity-90 filter brightness-95 saturate-110"
              />
              <p className="text-xl leading-relaxed text-center">
                Interactive workshop platform for real-time collaboration and engagement
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Access Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Access Method</h2>
            <p className="text-slate-600 text-lg">Join a workshop or manage events</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Attendee Access */}
            <div className="flex flex-col items-center">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2 text-center">Workshop Participant</h3>
                <p className="text-slate-600 text-center">
                  Have an access code? Join your workshop here
                </p>
              </div>
              <AccessCodeForm />
            </div>

            {/* Admin Access */}
            <div className="flex flex-col items-center">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2 text-center">Event Administrator</h3>
                <p className="text-slate-600 text-center">
                  Manage workshops and view all events
                </p>
              </div>
              <AdminAccessCard />
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
