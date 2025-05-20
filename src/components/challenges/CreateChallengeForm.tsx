
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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

const CreateChallengeForm = ({ onClose }: { onClose: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    sport: "",
    date: "",
    time: "",
    location: "",
    description: "",
    bid: "",
  });
  
  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // This would submit to Supabase
    console.log("Challenge data:", formData);
    
    setTimeout(() => {
      toast({
        title: "Challenge created!",
        description: "Your challenge is now visible to nearby players.",
      });
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };
  
  return (
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
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => updateFormData("location", e.target.value)}
          placeholder="Enter the location"
          required
        />
      </div>
      
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
      
      <div className="space-y-2">
        <Label htmlFor="bid">Bid Amount ($) - Optional</Label>
        <Input
          id="bid"
          type="number"
          min="0"
          step="0.01"
          value={formData.bid}
          onChange={(e) => updateFormData("bid", e.target.value)}
          placeholder="0.00"
        />
        <p className="text-xs text-muted-foreground">
          Set a bid amount if you want to add a monetary stake to this challenge
        </p>
      </div>
      
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
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
  );
};

export default CreateChallengeForm;
