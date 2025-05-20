
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import ProfileStep from './steps/ProfileStep';
import LocationStep from './steps/LocationStep';
import SportsStep from './steps/SportsStep';
import PhotoStep from './steps/PhotoStep';

const steps = ["Profile", "Location", "Sports", "Photo"];

type OnboardingData = {
  name: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  university: string;
  location: { lat: number; lng: number; address: string };
  sports: string[];
  profilePicture: File | null;
};

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    username: '',
    dateOfBirth: '',
    gender: '',
    university: '',
    location: { lat: 0, lng: 0, address: '' },
    sports: [],
    profilePicture: null,
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prevData => ({ ...prevData, ...newData }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // This would submit the data to Supabase
    console.log('Submitting onboarding data:', data);
    toast({
      title: "Profile setup complete!",
      description: "Welcome to SportConnect. Start exploring matches now!",
    });
    
    // Update the user's profileComplete status
    if (user) {
      setUser({ ...user, profileComplete: true, name: data.name, username: data.username });
    }
    
    // Redirect to the app dashboard
    navigate('/app/dashboard');
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">Set Up Your SportConnect Profile</h1>
        <div className="flex justify-center mt-6">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? "bg-sport-purple text-white"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-1 ${
                    index < currentStep ? "bg-sport-purple" : "bg-secondary"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="animate-slide-in">
        <CardContent className="pt-6">
          {currentStep === 0 && (
            <ProfileStep data={data} updateData={updateData} />
          )}
          {currentStep === 1 && (
            <LocationStep data={data} updateData={updateData} />
          )}
          {currentStep === 2 && (
            <SportsStep data={data} updateData={updateData} />
          )}
          {currentStep === 3 && (
            <PhotoStep data={data} updateData={updateData} />
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button 
              onClick={handleNext}
              className="bg-sport-purple hover:bg-sport-dark-purple"
            >
              {currentStep === steps.length - 1 ? "Complete" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
