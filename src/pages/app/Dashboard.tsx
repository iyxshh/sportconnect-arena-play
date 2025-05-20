
import { useState } from "react";
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

// Sample data that would be fetched from Supabase
const mockUser = {
  name: "Alex Johnson",
  username: "alexjohnson",
  university: "University of Sport",
  sports: ["basketball", "tennis", "running"],
  wins: 12,
  losses: 3,
  rank: "blue" as const,
};

const mockChallenges = [
  {
    id: "1",
    sport: "basketball",
    title: "Friendly 3v3 Basketball",
    location: "Downtown Courts",
    date: "2025-05-30",
    time: "18:00",
    distance: 1.2,
    creator: {
      name: "Mike Smith",
      rank: "pink" as const,
    },
  },
  {
    id: "2",
    sport: "tennis",
    title: "Tennis Singles Match",
    location: "Central Park Tennis Club",
    date: "2025-05-28",
    time: "14:30",
    distance: 3.5,
    creator: {
      name: "Sarah Wong",
      rank: "red" as const,
    },
    bid: 20,
  },
  {
    id: "3",
    sport: "running",
    title: "5K Challenge",
    location: "Riverside Park",
    date: "2025-05-29",
    time: "07:00",
    distance: 0.8,
    creator: {
      name: "David Lee",
      rank: "gold" as const,
    },
  },
];

const Dashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleJoinChallenge = (id: string) => {
    toast({
      title: "Challenge joined!",
      description: "You've successfully joined the challenge.",
    });
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="space-y-6">
            <ProfileCard user={mockUser} />
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Rank:</span>
                    <span className="font-medium">Competitor (Blue)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating Points:</span>
                    <span className="font-medium">1,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">District Standing:</span>
                    <span className="font-medium">14th</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Challenges:</span>
                    <span className="font-medium">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-sport-purple hover:bg-sport-dark-purple"
            >
              Create Challenge
            </Button>
          </div>
          
          <Tabs defaultValue="nearby" className="mb-8">
            <TabsList>
              <TabsTrigger value="nearby">Nearby Challenges</TabsTrigger>
              <TabsTrigger value="upcoming">Your Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Matches</TabsTrigger>
            </TabsList>
            <TabsContent value="nearby" className="pt-4">
              <div className="grid md:grid-cols-2 gap-6">
                {mockChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    {...challenge}
                    onJoin={handleJoinChallenge}
                  />
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <Button variant="outline">Load More</Button>
              </div>
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
