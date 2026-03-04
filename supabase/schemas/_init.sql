-- DATABASE INITIALIZATION
-- Set timezone to UTC for all operations

-- Set database timezone
ALTER DATABASE postgres SET timezone TO 'UTC';

-- Verify timezone setting
SELECT current_setting('TIMEZONE');

-- Create reusable updated_at trigger function (UTC)
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW() AT TIME ZONE 'UTC';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
