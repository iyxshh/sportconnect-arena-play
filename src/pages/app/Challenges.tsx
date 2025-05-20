
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import CreateChallengeForm from "@/components/challenges/CreateChallengeForm";
import { useToast } from "@/hooks/use-toast";

// Sample data
const mockNearby = [
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
  {
    id: "4",
    sport: "football",
    title: "5-a-side Football Match",
    location: "Community Fields",
    date: "2025-05-31",
    time: "16:00",
    distance: 2.3,
    creator: {
      name: "Tanya Roberts",
      rank: "blue" as const,
    },
  },
  {
    id: "5",
    sport: "volleyball",
    title: "Beach Volleyball Tournament",
    location: "Sunny Beach",
    date: "2025-05-31",
    time: "11:00",
    distance: 4.7,
    creator: {
      name: "Carlos Mendez",
      rank: "red" as const,
    },
    bid: 15,
  },
  {
    id: "6",
    sport: "swimming",
    title: "Freestyle Race",
    location: "Olympic Pool",
    date: "2025-06-01",
    time: "09:30",
    distance: 5.2,
    creator: {
      name: "Lydia Chen",
      rank: "gold" as const,
    },
  },
];

const Challenges = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");
  const [maxDistance, setMaxDistance] = useState(50);
  const { toast } = useToast();
  
  const handleJoinChallenge = (id: string) => {
    toast({
      title: "Challenge joined!",
      description: "You've successfully joined the challenge.",
    });
  };
  
  const filteredNearby = mockNearby.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          challenge.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = selectedSport === "all" || challenge.sport === selectedSport;
    const matchesDistance = challenge.distance <= maxDistance;
    
    return matchesSearch && matchesSport && matchesDistance;
  });
  
  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Challenges</h1>
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
          <TabsTrigger value="joined">Joined Challenges</TabsTrigger>
          <TabsTrigger value="created">Your Challenges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nearby" className="space-y-6 pt-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:max-w-xs"
            />
            
            <div className="flex flex-wrap gap-4">
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="basketball">Basketball</SelectItem>
                  <SelectItem value="football">Football</SelectItem>
                  <SelectItem value="tennis">Tennis</SelectItem>
                  <SelectItem value="volleyball">Volleyball</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="swimming">Swimming</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex flex-col space-y-2 w-full md:w-[250px]">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Distance ({maxDistance} km)</span>
                </div>
                <Slider
                  min={1}
                  max={50}
                  step={1}
                  value={[maxDistance]}
                  onValueChange={([value]) => setMaxDistance(value)}
                />
              </div>
            </div>
          </div>
          
          {filteredNearby.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNearby.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  {...challenge}
                  onJoin={handleJoinChallenge}
                />
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 border rounded-lg p-12 text-center">
              <h3 className="text-xl font-medium mb-2">No challenges found</h3>
              <p className="text-muted-foreground mb-6">
                No challenges match your filters, or there are no challenges nearby.
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-sport-purple hover:bg-sport-dark-purple"
              >
                Create a Challenge
              </Button>
            </div>
          )}
          
          {filteredNearby.length > 0 && (
            <div className="flex justify-center mt-6">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="joined" className="pt-4">
          <div className="bg-muted/50 border rounded-lg p-12 text-center">
            <h3 className="text-xl font-medium mb-2">No joined challenges</h3>
            <p className="text-muted-foreground mb-6">
              You haven't joined any challenges yet. Find and join challenges to compete!
            </p>
            <Button variant="outline" onClick={() => document.querySelector('[data-value="nearby"]')?.click()}>
              Browse Challenges
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="created" className="pt-4">
          <div className="bg-muted/50 border rounded-lg p-12 text-center">
            <h3 className="text-xl font-medium mb-2">No created challenges</h3>
            <p className="text-muted-foreground mb-6">
              You haven't created any challenges yet. Create a challenge to invite others!
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-sport-purple hover:bg-sport-dark-purple"
            >
              Create a Challenge
            </Button>
          </div>
        </TabsContent>
      </Tabs>

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

export default Challenges;
