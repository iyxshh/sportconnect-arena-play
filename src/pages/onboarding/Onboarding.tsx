
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

const Onboarding = () => {
  const { user } = useAuth();
  
  // Redirect if not logged in or profile is already complete
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  if (user.profileComplete) {
    return <Navigate to="/app/dashboard" />;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <OnboardingFlow />
    </div>
  );
};

export default Onboarding;
