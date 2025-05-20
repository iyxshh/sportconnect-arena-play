
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ProfileStepProps = {
  data: {
    name: string;
    username: string;
    dateOfBirth: string;
    gender: string;
    university: string;
  };
  updateData: (data: Partial<{
    name: string;
    username: string;
    dateOfBirth: string;
    gender: string;
    university: string;
  }>) => void;
};

const ProfileStep = ({ data, updateData }: ProfileStepProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-4">Personal Information</h2>
        <p className="text-muted-foreground mb-6">
          Tell us about yourself so other players can get to know you.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="John Smith"
            required
          />
        </div>

        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={data.username}
            onChange={(e) => updateData({ username: e.target.value })}
            placeholder="johnsmith123"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            This will be your unique identifier on SportConnect
          </p>
        </div>

        <div>
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => updateData({ dateOfBirth: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select 
            value={data.gender} 
            onValueChange={(value) => updateData({ gender: value })}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="university">College/University (Optional)</Label>
          <Input
            id="university"
            value={data.university}
            onChange={(e) => updateData({ university: e.target.value })}
            placeholder="University of Example"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileStep;
