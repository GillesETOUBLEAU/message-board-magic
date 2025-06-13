
-- Create events table to manage different workshops/events
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add event_id to existing tables
ALTER TABLE public.messages 
ADD COLUMN event_id UUID REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.projection_settings 
ADD COLUMN event_id UUID REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.workshop_users 
ADD COLUMN event_id UUID REFERENCES public.events(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_messages_event_id ON public.messages(event_id);
CREATE INDEX idx_projection_settings_event_id ON public.projection_settings(event_id);
CREATE INDEX idx_workshop_users_event_id ON public.workshop_users(event_id);

-- Create a default event and migrate existing data
INSERT INTO public.events (name, description, slug, is_active) 
VALUES ('Default Workshop', 'Default workshop event', 'default', true);

-- Update existing records to use the default event
UPDATE public.messages 
SET event_id = (SELECT id FROM public.events WHERE slug = 'default');

UPDATE public.projection_settings 
SET event_id = (SELECT id FROM public.events WHERE slug = 'default');

UPDATE public.workshop_users 
SET event_id = (SELECT id FROM public.events WHERE slug = 'default');

-- Make event_id NOT NULL after migration
ALTER TABLE public.messages 
ALTER COLUMN event_id SET NOT NULL;

ALTER TABLE public.projection_settings 
ALTER COLUMN event_id SET NOT NULL;

-- Add unique constraint for one projection_settings per event
ALTER TABLE public.projection_settings 
ADD CONSTRAINT unique_projection_settings_per_event UNIQUE (event_id);

-- Create trigger to update updated_at on events
CREATE TRIGGER update_events_updated_at 
BEFORE UPDATE ON public.events 
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Enable RLS on events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policy for events (everyone can read active events)
CREATE POLICY "Anyone can view active events" 
ON public.events 
FOR SELECT 
USING (is_active = true);

-- Create policy for admins to manage events (you'll need to implement admin check)
CREATE POLICY "Admins can manage events" 
ON public.events
FOR ALL
USING (true); -- Temporarily allow all, update this with proper admin check later
