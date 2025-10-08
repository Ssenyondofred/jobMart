import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhlfuqonarjpbmjvgqbu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobGZ1cW9uYXJqcGJtanZncWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MDM0NDMsImV4cCI6MjA3NDA3OTQ0M30.sGBK0_L6epF1uK7XrKvnR6v42IOD9gXHytHH8sBbrJ4'

export const supabase = createClient(supabaseUrl, supabaseKey);
