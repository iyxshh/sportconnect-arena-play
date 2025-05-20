
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPinIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { createChallenge } from "@/lib/supabase/queries";

const availableSports = [
  { id: "basketball", name: "Basketball", icon: "🏀" },
  { id: "football", name: "Football", icon: "⚽" },
  { id: "tennis", name: "Tennis", icon: "🎾" },
  { id: "volleyball", name: "Volleyball", icon: "🏐" },
  { id: "badminton", name: "Badminton", icon: "🏸" },
  { id: "running", name: "Running", icon: "🏃" },
  { id: "cycling", name: "Cycling", icon: "🚴" },
  { id: "swimming", name: "Swimming", icon: "🏊" },
  { id: "golf", name: "Golf", icon: "⛳" },
  { id: "tabletennis", name: "Table Tennis", icon: "🏓" },
  { id: "baseball", name: "Baseball", icon: "⚾" },
  { id: "rugby", name: "Rugby", icon: "🏉" },
];

const CreateChallenge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  // Check if this is a bid challenge from query params
  const searchParams = new URLSearchParams(location.search);
  const isBidChallenge = searchParams.get('type') === 'bid';
  
  // Check if user has verified phone for bid challenges
  if (isBidChallenge && !profile?.phone_verified) {
    navigate('/app/verify-phone');
  }
  
  const [formData, setFormData] = useState({
    title: "",
    sport: "",
    date: "",
    time: "",
    location: "",
    lat: profile?.user_locations?.[0]?.coordinates?.lat || 0,
    lng: profile?.user_locations?.[0]?.coordinates?.lng || 0,
    description: "",
    bid: isBidChallenge ? "5" : "", // Default bid amount if it's a bid challenge
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    // Validate form
    if (!formData.title || !formData.sport || !formData.date || !formData.time || !formData.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // If it's a bid challenge, validate bid amount
    if (isBidChallenge) {
      const bidAmount = parseFloat(formData.bid);
      if (isNaN(bidAmount) || bidAmount <= 0) {
        toast({
          title: "Invalid bid amount",
          description: "Please enter a valid bid amount",
          variant: "destructive"
        });
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      
      // Combine date and time into a start_time
      const startTime = new Date(`${formData.date}T${formData.time}`);
      
      // Create the challenge
      await createChallenge(user.id, {
        title: formData.title,
        sport: formData.sport,
        start_time: startTime.toISOString(),
        location: formData.location,
        lat: formData.lat,
        lng: formData.lng,
        status: "open",
        bid_amount: isBidChallenge ? Math.round(parseFloat(formData.bid) * 100) : null,
        description: formData.description,
      });
      
      toast({
        title: "Challenge created!",
        description: "Your challenge is now visible to nearby players.",
      });
      
      // Redirect to dashboard
      navigate('/app/dashboard');
      
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast({
        title: "Failed to create challenge",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLocationSelect = () => {
    // Here you would integrate with a map selection component
    // This is a placeholder for now
    toast({
      title: "Location picker",
      description: "Map location selection would open here",
    });
  };
  
  return (
    <div className="container py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{isBidChallenge ? "Create Bid Challenge" : "Create Friendly Challenge"}</CardTitle>
          <CardDescription>
            {isBidChallenge
              ? "Set up a match with a wager that gets held in escrow until the match is complete"
              : "Set up a friendly match and invite players in your area to compete"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Challenge Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                placeholder="E.g., Casual tennis match"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sport">Sport</Label>
              <Select
                value={formData.sport}
                onValueChange={(value) => updateFormData("sport", value)}
                required
              >
                <SelectTrigger id="sport">
                  <SelectValue placeholder="Select a sport" />
                </SelectTrigger>
                <SelectContent>
                  {availableSports.map((sport) => (
                    <SelectItem key={sport.id} value={sport.id}>
                      <span className="inline-flex items-center">
                        <span className="mr-2">{sport.icon}</span>
                        {sport.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateFormData("date", e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateFormData("time", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateFormData("location", e.target.value)}
                  placeholder="Enter the location"
                  required
                  className="flex-1"
                />
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleLocationSelect}
                  className="flex-shrink-0"
                >
                  <MapPinIcon className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter an address or click the map icon to select on map
              </p>
            </div>
            
            {isBidChallenge && (
              <div className="space-y-2">
                <Label htmlFor="bid">Bid Amount ($)</Label>
                <Input
                  id="bid"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.bid}
                  onChange={(e) => updateFormData("bid", e.target.value)}
                  placeholder="0.00"
                  required={isBidChallenge}
                />
                <p className="text-xs text-muted-foreground">
                  This amount will be held in escrow until the match is complete
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Add any details about the challenge..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/app/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-sport-purple hover:bg-sport-dark-purple"
              >
                {isSubmitting ? "Creating..." : "Create Challenge"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateChallenge;
