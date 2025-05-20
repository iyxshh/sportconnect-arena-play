
-- Enable PostGIS extension for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Core Tables
-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    bio TEXT,
    dob DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say')),
    college TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sports preferences
CREATE TABLE IF NOT EXISTS public.user_sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    sport TEXT NOT NULL,
    skill_level INT CHECK (skill_level BETWEEN 1 AND 10),
    UNIQUE(user_id, sport)
);

-- User locations for matchmaking
CREATE TABLE IF NOT EXISTS public.user_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    district TEXT NOT NULL,
    coordinates GEOMETRY(POINT, 4326) NOT NULL, -- Using PostGIS for location
    last_updated TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_user_locations_coordinates ON public.user_locations USING GIST(coordinates);

-- 2. Challenge & Match Tables
-- Challenges table for match proposals
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    sport TEXT NOT NULL,
    bid_amount INT DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('open', 'accepted', 'completed', 'canceled')) DEFAULT 'open',
    start_time TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    coordinates GEOMETRY(POINT, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_challenges_coordinates ON public.challenges USING GIST(coordinates);
CREATE INDEX idx_challenges_status_sport ON public.challenges(status, sport);

-- Challenge participants
CREATE TABLE IF NOT EXISTS public.challenge_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    UNIQUE(challenge_id, user_id)
);

-- Match results
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    winner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    loser_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    score TEXT,
    verified BOOLEAN DEFAULT FALSE,
    ended_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ranking & Social Tables
-- User rankings per sport and district
CREATE TABLE IF NOT EXISTS public.user_rankings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    sport TEXT NOT NULL,
    district TEXT NOT NULL,
    elo_rating FLOAT NOT NULL DEFAULT 1000,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    rank INT, -- Computed rank (updated via a function/trigger or cron job)
    UNIQUE(user_id, sport, district)
);
CREATE INDEX idx_rankings_leaderboard ON public.user_rankings(sport, district, elo_rating DESC);

-- Posts table for social feed
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('win', 'lose', 'achievement')),
    image_url TEXT,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Payment Tables
-- Payments for bid challenges
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    payer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount INT NOT NULL CHECK (amount > 0),
    status TEXT NOT NULL CHECK (status IN ('held', 'released', 'refunded')),
    stripe_payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security Policies
-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles" 
    ON public.users FOR SELECT 
    USING (true);

CREATE POLICY "Users can update own profile" 
    ON public.users FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.users FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- RLS Policies for user_sports
CREATE POLICY "Anyone can view user sports" 
    ON public.user_sports FOR SELECT 
    USING (true);

CREATE POLICY "Users can manage own sports"
    ON public.user_sports FOR ALL
    USING (auth.uid() = user_id);

-- RLS Policies for user_locations
CREATE POLICY "Anyone can view user locations"
    ON public.user_locations FOR SELECT
    USING (true);

CREATE POLICY "Users can manage own locations"
    ON public.user_locations FOR ALL
    USING (auth.uid() = user_id);

-- RLS Policies for challenges
CREATE POLICY "Anyone can view challenges"
    ON public.challenges FOR SELECT
    USING (true);

CREATE POLICY "Users can create challenges"
    ON public.challenges FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Challenge creators can update their challenges"
    ON public.challenges FOR UPDATE
    USING (auth.uid() = creator_id AND status = 'open');

-- RLS Policies for challenge_participants
CREATE POLICY "Anyone can view challenge participants"
    ON public.challenge_participants FOR SELECT
    USING (true);

CREATE POLICY "Users can join challenges"
    ON public.challenge_participants FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participation"
    ON public.challenge_participants FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies for matches
CREATE POLICY "Anyone can view matches"
    ON public.matches FOR SELECT
    USING (true);

CREATE POLICY "Match participants can update matches"
    ON public.matches FOR ALL
    USING (auth.uid() IN (winner_id, loser_id));

-- RLS Policies for user_rankings
CREATE POLICY "Anyone can view rankings"
    ON public.user_rankings FOR SELECT
    USING (true);

-- RLS Policies for posts
CREATE POLICY "Anyone can view posts"
    ON public.posts FOR SELECT
    USING (true);

CREATE POLICY "Users can manage own posts"
    ON public.posts FOR ALL
    USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies for payments
CREATE POLICY "Users can view payments they're involved in"
    ON public.payments FOR SELECT
    USING (
        auth.uid() = payer_id OR 
        auth.uid() IN (
            SELECT creator_id FROM public.challenges 
            WHERE challenges.id = payments.challenge_id
        )
    );

-- 6. Helper Functions
-- Function to find nearby challenges
CREATE OR REPLACE FUNCTION nearby_challenges(
    user_latitude DOUBLE PRECISION,
    user_longitude DOUBLE PRECISION,
    radius_meters INT DEFAULT 50000,
    sport_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    creator_id UUID,
    sport TEXT,
    bid_amount INT,
    status TEXT,
    start_time TIMESTAMPTZ,
    location TEXT,
    distance DOUBLE PRECISION,
    creator_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.creator_id,
        c.sport,
        c.bid_amount,
        c.status,
        c.start_time,
        c.location,
        ST_Distance(
            c.coordinates,
            ST_SetSRID(ST_MakePoint(user_longitude, user_latitude), 4326)
        ) AS distance,
        u.full_name AS creator_name
    FROM challenges c
    JOIN users u ON c.creator_id = u.id
    WHERE c.status = 'open'
    AND (sport_filter IS NULL OR c.sport = sport_filter)
    AND ST_DWithin(
        c.coordinates,
        ST_SetSRID(ST_MakePoint(user_longitude, user_latitude), 4326),
        radius_meters
    )
    ORDER BY c.start_time;
END;
$$ LANGUAGE plpgsql;

-- Function to update rankings after a match
CREATE OR REPLACE FUNCTION update_rankings_after_match()
RETURNS TRIGGER AS $$
DECLARE
    challenge_sport TEXT;
    challenge_district TEXT;
    winner_rating FLOAT;
    loser_rating FLOAT;
    rating_change FLOAT;
    k_factor FLOAT := 32; -- Elo K-factor
BEGIN
    -- Get the sport from the challenge
    SELECT sport INTO challenge_sport 
    FROM challenges 
    WHERE id = NEW.challenge_id;
    
    -- Get district from winner's location (simplified)
    SELECT district INTO challenge_district
    FROM user_locations
    WHERE user_id = NEW.winner_id
    ORDER BY last_updated DESC
    LIMIT 1;
    
    -- Get current ratings or create if not exists
    -- Winner
    SELECT elo_rating INTO winner_rating
    FROM user_rankings
    WHERE user_id = NEW.winner_id AND sport = challenge_sport AND district = challenge_district;
    
    IF NOT FOUND THEN
        INSERT INTO user_rankings (user_id, sport, district, wins, losses)
        VALUES (NEW.winner_id, challenge_sport, challenge_district, 0, 0)
        RETURNING elo_rating INTO winner_rating;
    END IF;
    
    -- Loser
    SELECT elo_rating INTO loser_rating
    FROM user_rankings
    WHERE user_id = NEW.loser_id AND sport = challenge_sport AND district = challenge_district;
    
    IF NOT FOUND THEN
        INSERT INTO user_rankings (user_id, sport, district, wins, losses)
        VALUES (NEW.loser_id, challenge_sport, challenge_district, 0, 0)
        RETURNING elo_rating INTO loser_rating;
    END IF;
    
    -- Calculate Elo rating change
    rating_change := k_factor * (1 - 1 / (1 + power(10, (loser_rating - winner_rating) / 400)));
    
    -- Update winner's rating and wins
    UPDATE user_rankings
    SET elo_rating = elo_rating + rating_change,
        wins = wins + 1
    WHERE user_id = NEW.winner_id AND sport = challenge_sport AND district = challenge_district;
    
    -- Update loser's rating and losses
    UPDATE user_rankings
    SET elo_rating = elo_rating - rating_change,
        losses = losses + 1
    WHERE user_id = NEW.loser_id AND sport = challenge_sport AND district = challenge_district;
    
    -- Update challenge status
    UPDATE challenges
    SET status = 'completed'
    WHERE id = NEW.challenge_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update rankings after a match is verified
CREATE TRIGGER after_match_verified
AFTER UPDATE ON matches
FOR EACH ROW
WHEN (NEW.verified = TRUE AND OLD.verified = FALSE)
EXECUTE FUNCTION update_rankings_after_match();

-- Function to recalculate ranks (run periodically)
CREATE OR REPLACE FUNCTION recalculate_ranks()
RETURNS VOID AS $$
DECLARE
    sport_district RECORD;
BEGIN
    -- For each sport and district combination
    FOR sport_district IN 
        SELECT DISTINCT sport, district FROM user_rankings
    LOOP
        -- Update ranks within each sport/district
        WITH ranked AS (
            SELECT 
                id,
                ROW_NUMBER() OVER (ORDER BY elo_rating DESC) as new_rank
            FROM user_rankings
            WHERE sport = sport_district.sport AND district = sport_district.district
        )
        UPDATE user_rankings ur
        SET rank = r.new_rank
        FROM ranked r
        WHERE ur.id = r.id
        AND (ur.rank IS NULL OR ur.rank != r.new_rank);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a function to notify users about challenge acceptance
CREATE OR REPLACE FUNCTION notify_challenge_accepted()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        -- Get the challenge creator
        INSERT INTO notifications (
            user_id,
            type,
            data
        )
        SELECT 
            c.creator_id, 
            'challenge_accepted',
            json_build_object(
                'challenge_id', NEW.challenge_id,
                'user_id', NEW.user_id,
                'user_name', u.full_name,
                'sport', c.sport
            )
        FROM challenges c
        JOIN users u ON NEW.user_id = u.id
        WHERE c.id = NEW.challenge_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for challenge acceptance notifications
CREATE TRIGGER on_challenge_accepted
AFTER UPDATE ON challenge_participants
FOR EACH ROW
EXECUTE FUNCTION notify_challenge_accepted();
