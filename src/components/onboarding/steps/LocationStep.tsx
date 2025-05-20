
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type LocationStepProps = {
  data: {
    location: { lat: number; lng: number; address: string };
  };
  updateData: (data: {
    location: { lat: number; lng: number; address: string };
  }) => void;
};

const LocationStep = ({ data, updateData }: LocationStepProps) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = () => {
    setIsDetecting(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Here we would normally use a reverse geocoding service 
        // to get the address from coordinates
        // For now, we'll just use the coordinates as the address
        
        updateData({
          location: {
            lat: latitude,
            lng: longitude,
            address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
          },
        });
        setIsDetecting(false);
      },
      (error) => {
        setError(`Error detecting location: ${error.message}`);
        setIsDetecting(false);
      }
    );
  };

  useEffect(() => {
    // Auto-detect location when component mounts if we don't have one
    if (!data.location.lat && !data.location.lng) {
      detectLocation();
    }
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-4">Your Location</h2>
        <p className="text-muted-foreground mb-6">
          We use your location to find nearby matches and challenges.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="bg-muted rounded-md p-4 flex justify-between items-center">
          <div>
            <p className="font-medium">Auto-detect my location</p>
            <p className="text-sm text-muted-foreground">
              We'll use your device's GPS to find your current location.
            </p>
          </div>
          <Button
            onClick={detectLocation}
            disabled={isDetecting}
            variant="outline"
          >
            {isDetecting ? "Detecting..." : "Detect"}
          </Button>
        </div>

        <div className="space-y-3 pt-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={data.location.address}
            onChange={(e) =>
              updateData({
                location: { ...data.location, address: e.target.value },
              })
            }
            placeholder="Enter your address manually"
          />
          <p className="text-xs text-muted-foreground">
            You can manually adjust your address if needed
          </p>
        </div>
      </div>

      <div className="h-48 bg-muted rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">
          {data.location.lat && data.location.lng 
            ? "Location detected 📍"
            : "Map will appear here"}
        </p>
      </div>
    </div>
  );
};

export default LocationStep;
