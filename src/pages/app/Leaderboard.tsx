
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";

// Sample data that would be fetched from Supabase
const mockPlayers = [
  {
    id: "1",
    name: "Emma Wilson",
    username: "emmaw",
    rank: "gold" as const,
    sport: "tennis",
    district: "Central District",
    points: 2850,
    position: 1,
  },
  {
    id: "2",
    name: "James Rodriguez",
    username: "jrod",
    rank: "gold" as const,
    sport: "basketball",
    district: "Central District",
    points: 2730,
    position: 2,
  },
  {
    id: "3",
    name: "Sophie Chen",
    username: "sophiec",
    rank: "gold" as const,
    sport: "running",
    district: "East District",
    points: 2620,
    position: 3,
  },
  {
    id: "4",
    name: "Michael Johnson",
    username: "mjohnson",
    rank: "red" as const,
    sport: "basketball",
    district: "West District",
    points: 2480,
    position: 4,
  },
  {
    id: "5",
    name: "Olivia Parker",
    username: "oparker",
    rank: "red" as const,
    sport: "tennis",
    district: "North District",
    points: 2350,
    position: 5,
  },
  {
    id: "6",
    name: "Daniel Kim",
    username: "dkim",
    rank: "red" as const,
    sport: "running",
    district: "South District",
    points: 2210,
    position: 6,
  },
  {
    id: "7",
    name: "Emily Thompson",
    username: "ethompson",
    rank: "red" as const,
    sport: "volleyball",
    district: "Central District",
    points: 2080,
    position: 7,
  },
  {
    id: "8",
    name: "Alex Johnson",
    username: "alexjohnson",
    rank: "blue" as const,
    sport: "basketball",
    district: "Central District",
    points: 1250,
    position: 14,
  },
];

const districts = [
  "All Districts",
  "Central District",
  "East District",
  "West District",
  "North District",
  "South District",
];

const sports = [
  "basketball",
  "football",
  "tennis",
  "volleyball",
  "badminton",
  "running",
  "cycling",
  "swimming",
];

const Leaderboard = () => {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">
            Top ranked players in your area
          </p>
        </div>
        <div className="bg-muted px-4 py-2 rounded-md flex items-center gap-2 mt-4 md:mt-0">
          <span className="text-sm font-medium">Your Rank:</span>
          <span className="rank-badge rank-badge-blue">14</span>
          <span className="text-sm ml-2">Alex Johnson</span>
        </div>
      </div>
      
      <LeaderboardTable
        players={mockPlayers}
        districts={districts}
        sports={sports}
      />
    </div>
  );
};

export default Leaderboard;
