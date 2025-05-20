
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type ProfileCardProps = {
  user: {
    name: string;
    username: string;
    profilePicture?: string;
    university?: string;
    sports: string[];
    wins: number;
    losses: number;
    rank?: "pink" | "blue" | "red" | "gold";
  };
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

const getRankTitle = (rank: "pink" | "blue" | "red" | "gold") => {
  switch (rank) {
    case "pink":
      return "Rookie";
    case "blue":
      return "Competitor";
    case "red":
      return "Champion";
    case "gold":
      return "Elite";
    default:
      return "";
  }
};

const ProfileCard = ({ user }: ProfileCardProps) => {
  const getInitials = () => {
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const winRate = user.wins + user.losses > 0 
    ? Math.round((user.wins / (user.wins + user.losses)) * 100) 
    : 0;

  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-sport-purple to-sport-dark-purple" />
      <CardHeader className="pt-0 relative">
        <div className="absolute -top-12 left-4 border-4 border-background rounded-full">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.profilePicture} />
            <AvatarFallback className="text-2xl bg-sport-light-purple text-sport-purple">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          {user.rank && (
            <div className={`absolute -bottom-1 -right-1 rank-badge rank-badge-${user.rank} w-8 h-8 text-sm border-2 border-background`}>
              {user.rank === "pink" ? "R" : user.rank === "blue" ? "C" : user.rank === "red" ? "CH" : "E"}
            </div>
          )}
        </div>
        <div className="pt-14 pl-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            {user.rank && (
              <Badge variant="outline" className="ml-1">
                {getRankTitle(user.rank)}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">@{user.username}</p>
          {user.university && (
            <p className="text-sm text-muted-foreground mt-1">
              {user.university}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {user.sports.map((sport) => (
            <Badge key={sport} variant="secondary">
              <span className="mr-1">{sportEmoji[sport] || "🏆"}</span>
              {sport.charAt(0).toUpperCase() + sport.slice(1)}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div className="bg-secondary/50 rounded-md p-3">
            <p className="text-2xl font-bold">{user.wins}</p>
            <p className="text-xs text-muted-foreground uppercase">Wins</p>
          </div>
          <div className="bg-secondary/50 rounded-md p-3">
            <p className="text-2xl font-bold">{user.losses}</p>
            <p className="text-xs text-muted-foreground uppercase">Losses</p>
          </div>
          <div className="bg-secondary/50 rounded-md p-3">
            <p className="text-2xl font-bold">{winRate}%</p>
            <p className="text-xs text-muted-foreground uppercase">Win Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
