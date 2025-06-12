
-- Add title field to projection_settings table
ALTER TABLE public.projection_settings 
ADD COLUMN title TEXT DEFAULT 'Workshop Ideas Board';
