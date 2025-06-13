
-- Add access code and access mode fields to events table
ALTER TABLE public.events 
ADD COLUMN access_code TEXT,
ADD COLUMN access_mode TEXT NOT NULL DEFAULT 'open' CHECK (access_mode IN ('open', 'code_protected'));

-- Create index for access code lookups
CREATE INDEX idx_events_access_code ON public.events(access_code) WHERE access_code IS NOT NULL;

-- Add table to track access attempts for security monitoring
CREATE TABLE public.event_access_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  attempted_code TEXT,
  user_email TEXT,
  user_name TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for access attempts monitoring
CREATE INDEX idx_event_access_attempts_event_id ON public.event_access_attempts(event_id);
CREATE INDEX idx_event_access_attempts_created_at ON public.event_access_attempts(created_at);

-- Enable RLS on event_access_attempts table
ALTER TABLE public.event_access_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy for access attempts (admins can view all, others can't see any)
CREATE POLICY "Admins can view access attempts" 
ON public.event_access_attempts 
FOR SELECT 
USING (true); -- Temporarily allow all, update with proper admin check later
