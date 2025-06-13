
-- First, update any existing events without access codes to have random codes
UPDATE public.events 
SET access_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6))
WHERE access_code IS NULL;

-- Now make access_code NOT NULL and set default access_mode to 'code_protected'
ALTER TABLE public.events 
ALTER COLUMN access_code SET NOT NULL,
ALTER COLUMN access_mode SET DEFAULT 'code_protected';

-- Update any events with 'open' access mode to 'code_protected'
UPDATE public.events 
SET access_mode = 'code_protected' 
WHERE access_mode = 'open';
