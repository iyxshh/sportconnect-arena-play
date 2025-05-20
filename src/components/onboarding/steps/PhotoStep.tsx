
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type PhotoStepProps = {
  data: {
    name: string;
    profilePicture: File | null;
  };
  updateData: (data: {
    profilePicture: File | null;
  }) => void;
};

const PhotoStep = ({ data, updateData }: PhotoStepProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    updateData({ profilePicture: file });
  };

  const removePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    updateData({ profilePicture: null });
  };

  // Get initials from name for the avatar fallback
  const getInitials = () => {
    if (!data.name) return "?";
    return data.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-4">Profile Photo</h2>
        <p className="text-muted-foreground mb-6">
          Add a profile picture so other players can recognize you.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6">
        <Avatar className="w-36 h-36">
          <AvatarImage src={previewUrl || undefined} />
          <AvatarFallback className="text-3xl bg-sport-light-purple text-sport-purple">
            {getInitials()}
          </AvatarFallback>
        </Avatar>

        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById("photo-upload")?.click()}
          >
            {previewUrl ? "Change Photo" : "Upload Photo"}
          </Button>
          
          {previewUrl && (
            <Button
              variant="outline"
              onClick={removePhoto}
              className="text-destructive hover:text-destructive"
            >
              Remove
            </Button>
          )}
          
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="mt-4 bg-muted p-4 rounded-md">
        <p className="text-sm text-muted-foreground">
          Choose a clear photo where your face is visible. This helps build trust with other players.
        </p>
      </div>
    </div>
  );
};

export default PhotoStep;
