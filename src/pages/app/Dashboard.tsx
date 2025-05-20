
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import CreateChallengeForm from "@/components/challenges/CreateChallengeForm";
import ProfileCard from "@/components/profile/ProfileCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getNearbyChallengesToday } from "@/lib/supabase/queries";

// Default location for Berlin (will be replaced by user's location)
const DEFAULT_LOCATION = { lat: 52.5200, lng: 13.4050 };

const Dashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  // Get user's location from profile or use default
  const userLocation = profile?.user_locations?.[0]?.coordinates || DEFAULT_LOCATION;
  
  // Query nearby challenges
  const { data: nearbyChallenges, isLoading: challengesLoading } = useQuery({
    queryKey: ['nearbyChallenges', userLocation],
    queryFn: () => getNearbyChallengesToday(userLocation.lat, userLocation.lng),
    enabled: !!userLocation
  });
  
  const handleJoinChallenge = (id: string) => {
    // Navigate to challenge detail/join page with the challenge ID
    navigate(`/app/challenges/${id}/join`);
  };

  const handleCreateBidChallenge = () => {
    // Check if user has verified phone (required for bid challenges)
    if (!profile?.phone_verified) {
      toast({
        title: "Phone verification required",
        description: "You need to verify your phone number to create bid challenges.",
        variant: "destructive",
      });
      navigate("/app/verify-phone");
      return;
    }
    
    // Navigate to create challenge page with bid mode enabled
    navigate("/app/create-challenge?type=bid");
  };

  const handleCreateFriendlyChallenge = () => {
    // Navigate to create challenge page for friendly challenges
    setIsDialogOpen(true);
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="space-y-6">
            {profile && <ProfileCard user={{
              name: profile.full_name || "",
              username: profile.username || "",
              university: profile.college || "",
              sports: profile.user_sports?.map(s => s.sport) || [],
              wins: profile.user_rankings?.reduce((acc, r) => acc + (r.wins || 0), 0) || 0,
              losses: profile.user_rankings?.reduce((acc, r) => acc + (r.losses || 0), 0) || 0,
              rank: profile.user_rankings?.[0]?.rank ? 
                profile.user_rankings[0].rank <= 24 ? "gold" :
                profile.user_rankings[0].rank <= 49 ? "red" :
                profile.user_rankings[0].rank <= 74 ? "blue" : "pink" : "pink"
            }} />}
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Rank:</span>
                    <span className="font-medium">
                      {profile?.user_rankings?.[0]?.rank ? `#${profile.user_rankings[0].rank}` : "Unranked"} 
                      {profile?.user_rankings?.[0]?.rank ? 
                        profile.user_rankings[0].rank <= 24 ? " (Gold)" :
                        profile.user_rankings[0].rank <= 49 ? " (Red)" :
                        profile.user_rankings[0].rank <= 74 ? " (Blue)" : " (Pink)" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating Points:</span>
                    <span className="font-medium">{profile?.user_rankings?.[0]?.elo_rating?.toFixed(0) || "1000"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">District Standing:</span>
                    <span className="font-medium">
                      {profile?.user_rankings?.[0]?.district ? 
                        `${profile.user_rankings[0].rank}th in ${profile.user_rankings[0].district}` : 
                        "Not ranked yet"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Challenges:</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleCreateBidChallenge}
                className="w-full bg-sport-dark-purple hover:bg-sport-purple"
              >
                Create Bid Challenge
              </Button>
              <Button 
                onClick={handleCreateFriendlyChallenge}
                className="w-full bg-sport-purple hover:bg-sport-dark-purple"
              >
                Create Friendly Challenge
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          
          <Tabs defaultValue="nearby" className="mb-8">
            <TabsList>
              <TabsTrigger value="nearby">Nearby Challenges</TabsTrigger>
              <TabsTrigger value="upcoming">Your Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Matches</TabsTrigger>
            </TabsList>
            <TabsContent value="nearby" className="pt-4">
              {challengesLoading ? (
                <div className="flex items-center justify-center p-12">
                  <p>Loading challenges...</p>
                </div>
              ) : nearbyChallenges && nearbyChallenges.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {nearbyChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      id={challenge.id}
                      sport={challenge.sport}
                      title={challenge.title || `${challenge.sport} Challenge`}
                      location={challenge.location}
                      date={new Date(challenge.start_time).toISOString().split('T')[0]}
                      time={new Date(challenge.start_time).toTimeString().split(' ')[0].substring(0, 5)}
                      distance={challenge.distance || 0}
                      creator={{
                        name: challenge.creator?.full_name || "Unknown",
                        rank: challenge.creator?.rank ? 
                          challenge.creator.rank <= 24 ? "gold" :
                          challenge.creator.rank <= 49 ? "red" :
                          challenge.creator.rank <= 74 ? "blue" : "pink" : "pink"
                      }}
                      bid={challenge.bid_amount ? challenge.bid_amount / 100 : undefined}
                      onJoin={() => handleJoinChallenge(challenge.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center p-12">
                    <div className="text-center">
                      <p className="text-muted-foreground">
                        No nearby challenges found.
                        <br />
                        Create your own to get started!
                      </p>
                      <Button 
                        className="mt-4 bg-sport-purple hover:bg-sport-dark-purple"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        Create Challenge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {nearbyChallenges && nearbyChallenges.length > 0 && (
                <div className="flex justify-center mt-6">
                  <Button variant="outline">Load More</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upcoming" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Upcoming Matches</CardTitle>
                  <CardDescription>
                    Challenges you've joined or created
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      You don't have any upcoming matches.
                      <br />
                      Join a challenge or create your own!
                    </p>
                    <Button 
                      className="mt-4 bg-sport-purple hover:bg-sport-dark-purple"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      Create Challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="past" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Past Matches</CardTitle>
                  <CardDescription>
                    Your match history and results
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      You haven't completed any matches yet.
                    </p>
                    <Button 
                      className="mt-4"
                      variant="outline"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      Find Challenges
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Challenge</DialogTitle>
            <DialogDescription>
              Set up a match and invite players in your area to compete.
            </DialogDescription>
          </DialogHeader>
          <CreateChallengeForm onClose={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
