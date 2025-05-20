
# SportConnect Database Schema

This document explains how to set up the SportConnect database schema in your Supabase project.

## Setup Instructions

1. **Login to your Supabase Dashboard**: Go to https://app.supabase.com/ and log in to your account.

2. **Create a new project** (if needed): Create a new Supabase project or use an existing one.

3. **Enable PostGIS extension**:
   - Go to the SQL Editor in your Supabase dashboard
   - Run the following SQL:
     ```sql
     CREATE EXTENSION IF NOT EXISTS postgis;
     ```

4. **Create the schema**:
   - Open the SQL Editor in your Supabase dashboard
   - Copy the entire contents of `src/database/schema.sql` into the SQL Editor
   - Run the SQL script

5. **Configure environment variables**:
   - Find your project URL and anon key in the Supabase dashboard under Settings > API
   - Create a `.env` file at the root of your project with:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

## Key Tables

### Core User Data
- `users`: Extends Supabase Auth with profile data
- `user_sports`: User's preferred sports and skill levels
- `user_locations`: User's district and geographical coordinates

### Challenge & Match System
- `challenges`: Game challenges created by users
- `challenge_participants`: Who has joined/accepted challenges
- `matches`: Results of completed matches

### Rankings & Social
- `user_rankings`: Elo-based skill rankings per sport and district
- `posts`: Social feed entries (win/loss celebrations, achievements)
- `notifications`: System notifications for users

### Payments
- `payments`: For tracking bid escrows and payouts via Stripe

## Helper Functions

The schema includes several PostgreSQL functions to simplify common operations:

- `nearby_challenges()`: Find open challenges near a geographical point
- `update_rankings_after_match()`: Updates Elo ratings when a match is verified
- `recalculate_ranks()`: Updates numerical rank positions within leaderboards

## Using the Schema in Your Code

Import the Supabase client and typed queries:

```typescript
import { supabase } from '@/lib/supabase/client';
import { getUserProfile, getNearbyChallengesToday } from '@/lib/supabase/queries';
```

Example: Getting a user profile:

```typescript
try {
  const userProfile = await getUserProfile(userId);
  console.log("User profile:", userProfile);
} catch (error) {
  console.error("Error fetching user profile:", error);
}
```

For more examples, look at the functions in `src/lib/supabase/queries.ts`.
