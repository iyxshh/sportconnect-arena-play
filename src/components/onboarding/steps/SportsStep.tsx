
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

type SportsStepProps = {
  data: {
    sports: string[];
  };
  updateData: (data: {
    sports: string[];
  }) => void;
};

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

const SportsStep = ({ data, updateData }: SportsStepProps) => {
  const [error, setError] = useState<string | null>(null);

  const toggleSport = (sportId: string) => {
    setError(null);
    if (data.sports.includes(sportId)) {
      updateData({
        sports: data.sports.filter((id) => id !== sportId),
      });
    } else {
      updateData({
        sports: [...data.sports, sportId],
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-4">Select Your Sports</h2>
        <p className="text-muted-foreground mb-2">
          Choose at least 2 sports you want to compete in.
        </p>
        <div className="flex flex-wrap gap-1 mb-4">
          {data.sports.length > 0 ? (
            data.sports.map((sport) => {
              const sportInfo = availableSports.find((s) => s.id === sport);
              return (
                <Badge key={sport} variant="secondary" className="mr-1 mb-1">
                  {sportInfo?.icon} {sportInfo?.name}
                </Badge>
              );
            })
          ) : (
            <span className="text-sm text-muted-foreground">No sports selected</span>
          )}
        </div>
        {error && <p className="text-sm text-destructive mb-4">{error}</p>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {availableSports.map((sport) => {
          const isSelected = data.sports.includes(sport.id);
          return (
            <Button
              key={sport.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className={`h-auto py-3 px-4 justify-start ${
                isSelected ? "bg-sport-purple hover:bg-sport-dark-purple" : ""
              }`}
              onClick={() => toggleSport(sport.id)}
            >
              <span className="mr-2 text-xl">{sport.icon}</span>
              <span>{sport.name}</span>
              {isSelected && <Check className="ml-auto h-4 w-4" />}
            </Button>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        {data.sports.length < 2
          ? `Please select at least ${2 - data.sports.length} more sport(s)`
          : "Great! You can always change these later."}
      </p>
    </div>
  );
};

export default SportsStep;
