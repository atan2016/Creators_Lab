-- Enable Row Level Security (RLS) on all tables in the public schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
--
-- Why: Supabase exposes tables via PostgREST. Without RLS, API access could
-- expose all data. With RLS enabled (and no permissive policies), PostgREST
-- requests get no rows. Prisma uses a role that bypasses RLS, so the LMS
-- continues to work normally.

-- User
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Classroom
ALTER TABLE "Classroom" ENABLE ROW LEVEL SECURITY;

-- ClassroomMember
ALTER TABLE "ClassroomMember" ENABLE ROW LEVEL SECURITY;

-- Resource
ALTER TABLE "Resource" ENABLE ROW LEVEL SECURITY;

-- ResourceCopy
ALTER TABLE "ResourceCopy" ENABLE ROW LEVEL SECURITY;

-- ForumPost
ALTER TABLE "ForumPost" ENABLE ROW LEVEL SECURITY;

-- HomeworkSubmission
ALTER TABLE "HomeworkSubmission" ENABLE ROW LEVEL SECURITY;

-- SyllabusEntry
ALTER TABLE "SyllabusEntry" ENABLE ROW LEVEL SECURITY;

-- GoogleDriveLink
ALTER TABLE "GoogleDriveLink" ENABLE ROW LEVEL SECURITY;

-- Location
ALTER TABLE "Location" ENABLE ROW LEVEL SECURITY;

-- Schedule
ALTER TABLE "Schedule" ENABLE ROW LEVEL SECURITY;

-- ActivityLog
ALTER TABLE "ActivityLog" ENABLE ROW LEVEL SECURITY;

-- TimeEntry
ALTER TABLE "TimeEntry" ENABLE ROW LEVEL SECURITY;
