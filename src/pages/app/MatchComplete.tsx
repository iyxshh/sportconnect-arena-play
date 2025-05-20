
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DownloadIcon, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MatchComplete = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  // Get the winner parameter from URL
  const searchParams = new URLSearchParams(location.search);
  const winner = searchParams.get('winner');
  const didUserWin = winner === 'me';
  
  // State for the generated poster
  const [posterImage, setPosterImage] = useState<string | null>(null);
  
  // This would fetch the match details from Supabase
  const { data: match, isLoading } = useQuery({
    queryKey: ['match-complete', id],
    queryFn: async () => {
      // Placeholder data until connected to real API
      return {
        id: id || '1',
        challenge: {
          id: "challenge123",
          title: "Friendly Tennis Match",
          sport: "tennis",
          location: "Central Park Tennis Club"
        },
        winner_id: didUserWin ? user?.id : "opponent-id",
        loser_id: didUserWin ? "opponent-id" : user?.id,
        score: "6-4, 7-5",
        verified: false,
        ended_at: new Date().toISOString(),
        opponent: {
          id: "opponent-id",
          full_name: "Sarah Williams",
          username: "sarahw",
          avatar_url: ""
        }
      };
    },
    enabled: !!id
  });
  
  // Effect to generate a "poster" image (simulated for now)
  useEffect(() => {
    if (match && user) {
      // In a real implementation, this would make an API call to generate a victory/defeat poster
      // For now, we'll just simulate the image being loaded after a delay
      setTimeout(() => {
        setPosterImage(`https://via.placeholder.com/600x400/${didUserWin ? '4CAF50' : 'F44336'}/FFFFFF?text=${didUserWin ? 'Victory' : 'Good+Try'}`);
      }, 1500);
    }
  }, [match, user, didUserWin]);
  
  const handleShareResult = () => {
    if (navigator.share && posterImage) {
      navigator.share({
        title: `${didUserWin ? 'Victory' : 'Match result'} on SportConnect`,
        text: `Check out my ${match?.challenge.sport} match result on SportConnect!`,
        url: window.location.href
      }).catch((err) => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      toast({
        title: "Share your results",
        description: "You can screenshot this page to share on social media",
      });
    }
  };
  
  const handleDownloadPoster = () => {
    if (posterImage) {
      // In a real implementation, this would download the actual generated image
      const link = document.createElement('a');
      link.href = posterImage;
      link.download = `sportconnect-${didUserWin ? 'victory' : 'match'}-poster.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <p>Loading match results...</p>
      </div>
    );
  }
  
  if (!match) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Match not found</h2>
              <p className="text-gray-600 mt-2">This match may have been removed or doesn't exist.</p>
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
  
  return (
    <div className="container py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className={didUserWin ? "text-green-600" : "text-red-600"}>
            {didUserWin ? "Victory!" : "Good Match!"}
          </CardTitle>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="py-6">
          <div className="text-center mb-6">
            <p className="text-lg font-medium">{match.challenge.title}</p>
            <p className="text-muted-foreground">
              {new Date(match.ended_at).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-muted-foreground">{match.challenge.location}</p>
          </div>
          
          <div className="flex justify-center items-center mb-6">
            <div className="text-center mr-6">
              <Avatar className="h-16 w-16 mx-auto mb-2">
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name} />
                <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <p className="font-medium">{profile?.full_name || user?.email}</p>
              <p className="text-xs text-muted-foreground">@{profile?.username || "user"}</p>
            </div>
            
            <div className="mx-4 flex flex-col items-center">
              <div className="text-xl font-bold">VS</div>
              {match.score && (
                <div className="mt-2 text-sm px-3 py-1 bg-muted rounded-full">
                  {match.score}
                </div>
              )}
            </div>
            
            <div className="text-center ml-6">
              <Avatar className="h-16 w-16 mx-auto mb-2">
                <AvatarImage src={match.opponent.avatar_url || ""} alt={match.opponent.full_name} />
                <AvatarFallback>{match.opponent.full_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="font-medium">{match.opponent.full_name}</p>
              <p className="text-xs text-muted-foreground">@{match.opponent.username}</p>
            </div>
          </div>
          
          <div className="mt-8 mb-4">
            <h3 className="text-base font-medium mb-3">Your Match Poster</h3>
            <div className="border rounded-md overflow-hidden">
              {posterImage ? (
                <img 
                  src={posterImage} 
                  alt="Match result poster" 
                  className="w-full h-auto"
                />
              ) : (
                <div className="h-48 bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Generating your poster...</p>
                </div>
              )}
            </div>
          </div>
          
          {!match.verified && (
            <div className="rounded-md bg-amber-50 p-4 mt-4 border border-amber-200">
              <p className="text-sm text-amber-800">
                This result is pending verification from your opponent. Your ranking will be updated once verified.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/app/dashboard')}
            className="mr-auto"
          >
            Back to Dashboard
          </Button>
          
          {posterImage && (
            <>
              <Button
                variant="outline"
                onClick={handleDownloadPoster}
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download Poster
              </Button>
              
              <Button
                onClick={handleShareResult}
                className="bg-sport-purple hover:bg-sport-dark-purple"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Result
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default MatchComplete;
