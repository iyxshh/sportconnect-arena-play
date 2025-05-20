
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Player = {
  id: string;
  name: string;
  username: string;
  profilePicture?: string;
  rank: "pink" | "blue" | "red" | "gold";
  sport: string;
  district: string;
  points: number;
  position: number;
};

type LeaderboardTableProps = {
  players: Player[];
  districts: string[];
  sports: string[];
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
  all: "🏆",
};

const LeaderboardTable = ({ players: initialPlayers, districts, sports }: LeaderboardTableProps) => {
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Filter players based on selected filters
  const filteredPlayers = initialPlayers.filter(player => {
    const matchesSport = selectedSport === "all" || player.sport === selectedSport;
    const matchesDistrict = selectedDistrict === "all" || player.district === selectedDistrict;
    const matchesSearch = 
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSport && matchesDistrict && matchesSearch;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search players..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        
        <div className="flex gap-2 ml-auto">
          <Select
            value={selectedSport}
            onValueChange={setSelectedSport}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="inline-flex items-center">
                  <span className="mr-2">🏆</span>
                  All Sports
                </span>
              </SelectItem>
              {sports.map(sport => (
                <SelectItem key={sport} value={sport}>
                  <span className="inline-flex items-center">
                    <span className="mr-2">{sportEmoji[sport] || "🏆"}</span>
                    {sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedDistrict}
            onValueChange={setSelectedDistrict}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map(district => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[80px]">
                  Rank
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Player
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">
                  District
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player) => (
                <tr
                  key={player.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex justify-center">
                      <div className={`rank-badge rank-badge-${player.rank} w-8 h-8`}>
                        {player.position}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={player.profilePicture} />
                        <AvatarFallback className="bg-sport-light-purple">
                          {player.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-xs text-muted-foreground">@{player.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle hidden md:table-cell">
                    {player.district}
                  </td>
                  <td className="p-4 align-middle text-right font-medium">
                    {player.points.toLocaleString()}
                  </td>
                </tr>
              ))}
              
              {filteredPlayers.length === 0 && (
                <tr>
                  <td colSpan={4} className="h-24 text-center text-muted-foreground">
                    No players found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button variant="outline" size="sm" className="text-muted-foreground">
          Load More
        </Button>
      </div>
    </div>
  );
};

export default LeaderboardTable;
