
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ChallengeCardProps = {
  id: string;
  sport: string;
  title: string;
  location: string;
  date: string;
  time: string;
  distance: number;
  creator: {
    name: string;
    avatar?: string;
    rank?: "pink" | "blue" | "red" | "gold";
  };
  bid?: number;
  onJoin: (id: string) => void;
};

const sportEmoji: Record<string, string> = {
  basketball: "🏀",
  football: "⚽",
  tennis: "🎾",
  volleyball: "🏐",
  badminton: "🏸",
  running: "🏃",
  cycling: "🚴",
  swimming: "🏊",
  golf: "⛳",
  tabletennis: "🏓",
  baseball: "⚾",
  rugby: "🏉",
};

const ChallengeCard = ({
  id,
  sport,
  title,
  location,
  date,
  time,
  distance,
  creator,
  bid,
  onJoin,
}: ChallengeCardProps) => {
  const sportIcon = sportEmoji[sport] || "🏆";
  
  return (
    <Card className="challenge-card overflow-hidden">
      {bid && (
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-sport-purple rotate-45">
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold text-white">
            ${bid}
          </div>
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="px-2 py-1">
            <span className="mr-1">{sportIcon}</span>
            {sport.charAt(0).toUpperCase() + sport.slice(1)}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>{distance.toFixed(1)} km away</span>
          </div>
        </div>
        <CardTitle className="text-xl mt-2">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <div className="text-muted-foreground">When:</div>
            <div>{date} • {time}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-muted-foreground">Where:</div>
            <div className="max-w-[200px] truncate text-right">{location}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={creator.avatar} />
              <AvatarFallback className="bg-sport-light-purple">
                {creator.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center">
              <span className="text-sm font-medium">{creator.name}</span>
              {creator.rank && (
                <span className={`rank-badge rank-badge-${creator.rank} ml-1`}></span>
              )}
            </div>
          </div>
          
          <Button 
            size="sm" 
            onClick={() => onJoin(id)}
            className="bg-sport-purple hover:bg-sport-dark-purple"
          >
            Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;
