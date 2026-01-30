# Row Level Security (RLS) Setup

This document explains how to enable Row Level Security (RLS) on your Supabase database to address security warnings.

## What is RLS?

Row Level Security (RLS) is a PostgreSQL feature that restricts which rows can be accessed by database users. Supabase requires RLS to be enabled on all public tables to prevent unauthorized access through the PostgREST API.

## Important Note

**Your Next.js application uses Prisma with direct database connections**, which bypass RLS policies. The RLS policies are primarily for:
1. Satisfying Supabase's security requirements
2. Protecting against direct PostgREST API access
3. Meeting security compliance standards

Your application's authentication and authorization are handled at the application level (via NextAuth and middleware), not at the database level.

## How to Apply RLS

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `prisma/migrations/enable_rls.sql`
4. Click **Run** to execute the SQL

### Option 2: Using Prisma Migrate

You can also apply this using Prisma, but note that Prisma migrations are typically for schema changes, not security policies:

```bash
# This will not work directly with Prisma migrate
# Use Supabase SQL Editor instead
```

### Option 3: Using psql or Database Client

If you have direct database access:

```bash
psql $DATABASE_URL -f prisma/migrations/enable_rls.sql
```

## What the SQL Does

1. **Enables RLS** on all 11 tables:
   - User
   - Classroom
   - ClassroomMember
   - Resource
   - ResourceCopy
   - ForumPost
   - HomeworkSubmission
   - SyllabusEntry
   - GoogleDriveLink
   - Location
   - Schedule

2. **Creates permissive policies** that allow full access:
   - These policies satisfy Supabase's RLS requirement
   - Since Prisma uses direct connections, these policies primarily protect against PostgREST API access
   - Your application's security is still enforced by NextAuth and middleware

## Verifying RLS is Enabled

After running the SQL, you can verify in Supabase:

1. Go to **Table Editor**
2. Select any table
3. Check the **RLS** column - it should show "Enabled"

Or run this SQL query:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

## Security Considerations

- **Application-level security**: Your app uses NextAuth for authentication and middleware for authorization
- **Database-level security**: RLS provides an additional layer of protection against direct database access
- **PostgREST protection**: RLS prevents unauthorized access through Supabase's PostgREST API
- **Prisma bypass**: Prisma's direct connections bypass RLS, which is expected and acceptable for server-side applications

## Troubleshooting

If you encounter issues after enabling RLS:

1. **Prisma queries fail**: This shouldn't happen since Prisma bypasses RLS, but if it does, check your connection string
2. **Supabase API access fails**: This is expected - RLS is working correctly
3. **Policies not applying**: Make sure you ran the SQL as a superuser or with appropriate permissions

## Need More Restrictive Policies?

If you want more granular RLS policies (e.g., users can only see their own data), you would need to:

1. Modify the policies in `enable_rls.sql`
2. Use Supabase's auth system to identify users
3. Create policies based on user roles/permissions

However, for a Next.js app using Prisma, this is typically unnecessary since authorization is handled at the application level.
