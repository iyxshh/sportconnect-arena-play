
import { supabase } from './client';
import type { Database, Tables, InsertDTO, UpdateDTO } from './database.types';

// User profile queries
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      user_sports (
        sport,
        skill_level
      ),
      user_locations (
        district,
        coordinates,
        last_updated
      ),
      user_rankings (
        sport,
        district,
        elo_rating,
        rank,
        wins,
        losses
      )
    `)
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId: string, updates: UpdateDTO<'users'>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserSports = async (
  userId: string, 
  sports: { sport: string, skill_level?: number }[]
) => {
  // Delete existing sports for this user
  const { error: deleteError } = await supabase
    .from('user_sports')
    .delete()
    .eq('user_id', userId);
  
  if (deleteError) throw deleteError;
  
  // Insert new sports
  const sportsToInsert = sports.map(s => ({
    user_id: userId,
    sport: s.sport,
    skill_level: s.skill_level || 5 // Default to mid-level if not specified
  }));
  
  const { data, error } = await supabase
    .from('user_sports')
    .insert(sportsToInsert)
    .select();
  
  if (error) throw error;
  return data;
};

export const updateUserLocation = async (
  userId: string, 
  district: string, 
  lat: number, 
  lng: number
) => {
  // We use PostGIS POINT type for coordinates
  const pointValue = `POINT(${lng} ${lat})`;
  
  const { data, error } = await supabase
    .from('user_locations')
    .upsert({
      user_id: userId,
      district,
      coordinates: pointValue as unknown as any, // Type casting for the PostGIS value
      last_updated: new Date().toISOString()
    })
    .select();
  
  if (error) throw error;
  return data;
};

// Challenges queries
export const getNearbyChallengesToday = async (
  lat: number, 
  lng: number, 
  sportFilter?: string,
  radiusKm: number = 50
) => {
  // Using our custom function for nearby challenges
  const { data, error } = await supabase.rpc('nearby_challenges', {
    user_latitude: lat,
    user_longitude: lng,
    radius_meters: radiusKm * 1000,
    sport_filter: sportFilter || null
  });
  
  if (error) throw error;
  return data;
};

export const createChallenge = async (
  creatorId: string, 
  challenge: Omit<InsertDTO<'challenges'>, 'creator_id' | 'coordinates'> & {
    lat: number,
    lng: number
  }
) => {
  // Create PostGIS POINT value from lat/lng
  const pointValue = `POINT(${challenge.lng} ${challenge.lat})`;
  
  // Remove lat/lng from the challenge object
  const { lat, lng, ...challengeData } = challenge;
  
  const { data, error } = await supabase
    .from('challenges')
    .insert({
      ...challengeData,
      creator_id: creatorId,
      coordinates: pointValue as unknown as any // Type casting for the PostGIS value
    })
    .select();
  
  if (error) throw error;
  return data;
};

export const acceptChallenge = async (challengeId: string, userId: string) => {
  // First check if there's already a participation record
  const { data: existingParticipation } = await supabase
    .from('challenge_participants')
    .select()
    .eq('challenge_id', challengeId)
    .eq('user_id', userId)
    .single();
  
  if (existingParticipation) {
    // Update existing participation
    const { data, error } = await supabase
      .from('challenge_participants')
      .update({ status: 'accepted' })
      .eq('id', existingParticipation.id)
      .select();
      
    if (error) throw error;
    return data;
  } else {
    // Create new participation
    const { data, error } = await supabase
      .from('challenge_participants')
      .insert({
        challenge_id: challengeId,
        user_id: userId,
        status: 'accepted'
      })
      .select();
      
    if (error) throw error;
    return data;
  }
};

export const getUserChallenges = async (userId: string) => {
  // Get challenges created by the user
  const { data: createdChallenges, error: createdError } = await supabase
    .from('challenges')
    .select(`
      *,
      challenge_participants (
        user_id,
        status
      )
    `)
    .eq('creator_id', userId);
  
  if (createdError) throw createdError;
  
  // Get challenges the user is participating in
  const { data: participatingChallenges, error: participatingError } = await supabase
    .from('challenge_participants')
    .select(`
      status,
      challenges (
        *,
        users (
          username,
          full_name,
          avatar_url
        )
      )
    `)
    .eq('user_id', userId);
  
  if (participatingError) throw participatingError;
  
  return {
    created: createdChallenges,
    participating: participatingChallenges
  };
};

// Leaderboard queries
export const getLeaderboard = async (sport: string, district?: string) => {
  let query = supabase
    .from('user_rankings')
    .select(`
      id,
      user_id,
      sport,
      district,
      elo_rating,
      wins,
      losses,
      rank,
      users (
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('sport', sport)
    .order('rank', { ascending: true })
    .limit(100);
  
  if (district) {
    query = query.eq('district', district);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

// Match results
export const submitMatchResult = async (
  challengeId: string,
  winnerId: string,
  loserId: string,
  score?: string
) => {
  const { data, error } = await supabase
    .from('matches')
    .insert({
      challenge_id: challengeId,
      winner_id: winnerId,
      loser_id: loserId,
      score,
      verified: false
    })
    .select();
  
  if (error) throw error;
  return data;
};

export const verifyMatchResult = async (matchId: string) => {
  const { data, error } = await supabase
    .from('matches')
    .update({ verified: true })
    .eq('id', matchId)
    .select();
  
  if (error) throw error;
  return data;
};

// Notifications
export const getUserNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const markNotificationsAsRead = async (notificationIds: string[]) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .in('id', notificationIds)
    .select();
  
  if (error) throw error;
  return data;
};
