
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";
import { submitMatchResult } from "@/lib/supabase/queries";

const SubmitResult = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [winner, setWinner] = useState("");
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // This would fetch the challenge details including participants
  const { data: challenge, isLoading } = useQuery({
    queryKey: ['challenge-for-result', id],
    queryFn: async () => {
      // Placeholder data until connected to real API
      return {
        id: id || '1',
        title: "Friendly Tennis Match",
        sport: "tennis",
        creator: {
          id: "abc123",
          full_name: "Alex Johnson"
        },
        opponent: {
          id: "xyz789",
          full_name: "Sarah Williams"
        }
      };
    },
    enabled: !!id
  });
  
  const handleSubmitResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user?.id || !challenge) return;
    
    if (!winner) {
      toast({
        title: "Missing information",
        description: "Please select the winner",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Determine winner and loser IDs
      const winnerId = winner === "me" ? user.id : 
                      (winner === "opponent" && challenge.opponent ? challenge.opponent.id : challenge.creator.id);
      
      const loserId = winner === "me" ? 
                      (challenge.opponent ? challenge.opponent.id : challenge.creator.id) : user.id;
      
      // Submit match result
      await submitMatchResult(id, winnerId, loserId, score);
      
      toast({
        title: "Result submitted!",
        description: "Your match result has been recorded. Waiting for verification.",
      });
      
      // Redirect to the match completion/poster page
      navigate(`/app/matches/${id}/complete?winner=${winnerId === user.id ? 'me' : 'opponent'}`);
    } catch (error) {
      console.error('Error submitting result:', error);
      toast({
        title: "Failed to submit result",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <p>Loading match details...</p>
      </div>
    );
  }
  
  if (!challenge) {
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
  
  // Determine who the opponent is based on the user ID
  const isCreator = user?.id === challenge.creator.id;
  const opponent = isCreator ? challenge.opponent : challenge.creator;
  
  return (
    <div className="container py-8 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Submit Match Result</CardTitle>
          <CardDescription>
            Record the outcome of your {challenge.sport} match with {opponent.full_name}
          </CardDescription>
        </CardHeader>
        
        <Separator />
        
        <form onSubmit={handleSubmitResult}>
          <CardContent className="py-6 space-y-6">
            <div>
              <h3 className="text-base font-semibold mb-3">Who won the match?</h3>
              <RadioGroup value={winner} onValueChange={setWinner} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="me" id="me" />
                  <Label htmlFor="me" className="font-medium">I won</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="opponent" id="opponent" />
                  <Label htmlFor="opponent" className="font-medium">{opponent.full_name} won</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="score" className="text-base font-semibold">Score (Optional)</Label>
              <Input
                id="score"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="E.g., 6-4, 7-5 or 21-18"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the final score in the appropriate format for your sport
              </p>
            </div>
            
            <div>
              <Label htmlFor="notes" className="text-base font-semibold">Match Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about the match..."
                className="mt-2"
                rows={3}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/app/dashboard')}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={!winner || isSubmitting}
              className="bg-sport-purple hover:bg-sport-dark-purple"
            >
              {isSubmitting ? "Submitting..." : "Submit Result"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SubmitResult;
