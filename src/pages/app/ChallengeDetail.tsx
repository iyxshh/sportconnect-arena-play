
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPinIcon, Clock, Calendar, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { acceptChallenge } from "@/lib/supabase/queries";

const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  
  // This would fetch the challenge details from Supabase
  const { data: challenge, isLoading } = useQuery({
    queryKey: ['challenge', id],
    queryFn: async () => {
      // Placeholder data until connected to real API
      return {
        id: id || '1',
        title: "Friendly Tennis Match",
        sport: "tennis",
        start_time: "2025-06-10T14:00:00Z",
        location: "Central Park Tennis Club",
        description: "Looking for a casual tennis match. I'm at intermediate level, would be great to play for about 1-2 hours.",
        bid_amount: 1000, // in cents ($10)
        status: "open",
        creator: {
          id: "abc123",
          full_name: "Alex Johnson",
          username: "alextennis",
          avatar_url: "",
          rank: 32,
          wins: 12,
          losses: 3
        },
        participants: []
      };
    },
    enabled: !!id
  });
  
  const handleJoinChallenge = async () => {
    if (!id || !user?.id) return;
    
    try {
      setIsJoining(true);
      
      // Call Supabase function to join/accept challenge
      await acceptChallenge(id, user.id);
      
      toast({
        title: "Challenge accepted!",
        description: "You have successfully joined the challenge.",
      });
      
      // Redirect to dashboard or upcoming matches
      navigate('/app/dashboard?tab=upcoming');
    } catch (error) {
      console.error('Error joining challenge:', error);
      toast({
        title: "Failed to join challenge",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsJoining(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <p>Loading challenge details...</p>
      </div>
    );
  }
  
  if (!challenge) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Challenge not found</h2>
              <p className="text-gray-600 mt-2">This challenge may have been removed or doesn't exist.</p>
              <Button 
                onClick={() => navigate('/app/dashboard')} 
                className="mt-6 bg-sport-purple hover:bg-sport-dark-purple"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Format the date and time
  const date = new Date(challenge.start_time);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Determine the creator's rank color
  const rankColor = 
    challenge.creator.rank <= 24 ? "gold" :
    challenge.creator.rank <= 49 ? "red" :
    challenge.creator.rank <= 74 ? "blue" : "pink";
  
  // Check if this is the user's own challenge
  const isCreator = user?.id === challenge.creator.id;
  
  // Check if user has already joined
  const hasJoined = challenge.participants.some(p => p.user_id === user?.id);
  
  return (
    <div className="container py-8 max-w-3xl">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="capitalize text-sm font-normal">
              {challenge.sport}
            </Badge>
            
            {challenge.bid_amount > 0 && (
              <Badge className="bg-amber-500 hover:bg-amber-600">
                <DollarSign className="h-3 w-3 mr-1" /> 
                ${(challenge.bid_amount / 100).toFixed(2)} Bid
              </Badge>
            )}
          </div>
          
          <CardTitle className="text-2xl mt-2">{challenge.title}</CardTitle>
          
          <div className="flex items-center mt-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={challenge.creator.avatar_url || ""} alt={challenge.creator.full_name} />
              <AvatarFallback>{challenge.creator.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <p className="text-sm font-medium">{challenge.creator.full_name}</p>
              <p className="text-xs text-muted-foreground">@{challenge.creator.username}</p>
            </div>
            <div className="ml-auto flex items-center">
              <Badge
                variant="outline"
                className={`ml-1 ${
                  rankColor === "gold" ? "border-amber-500 text-amber-700" :
                  rankColor === "red" ? "border-red-500 text-red-700" :
                  rankColor === "blue" ? "border-blue-500 text-blue-700" :
                  "border-pink-500 text-pink-700"
                }`}
              >
                Rank #{challenge.creator.rank}
              </Badge>
              <span className="ml-2 text-xs text-muted-foreground">
                {challenge.creator.wins}-{challenge.creator.losses} W/L
              </span>
            </div>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="py-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-muted-foreground mr-3" />
              <span>{formattedTime}</span>
            </div>
            
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 text-muted-foreground mr-3" />
              <span>{challenge.location}</span>
            </div>
            
            {challenge.participants.length > 0 && (
              <div className="flex items-center">
                <Users className="h-5 w-5 text-muted-foreground mr-3" />
                <span>{challenge.participants.length} participant(s) joined</span>
              </div>
            )}
          </div>
          
          {challenge.description && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{challenge.description}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/app/dashboard')}
          >
            Back
          </Button>
          
          {!isCreator && !hasJoined && (
            <Button
              onClick={handleJoinChallenge}
              disabled={isJoining}
              className="bg-sport-purple hover:bg-sport-dark-purple"
            >
              {isJoining ? "Joining..." : challenge.bid_amount > 0 ? "Accept Bid & Join" : "Join Challenge"}
            </Button>
          )}
          
          {isCreator && (
            <Button
              onClick={() => navigate(`/app/challenges/${id}/edit`)}
              variant="default"
            >
              Edit Challenge
            </Button>
          )}
          
          {hasJoined && (
            <Button className="bg-green-600 hover:bg-green-700">
              Already Joined
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChallengeDetail;
