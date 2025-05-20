
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { startPhoneVerification, verifyPhone } from "@/lib/supabase/client";

const VerifyPhone = () => {
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const handleSendCode = async () => {
    if (!phone || phone.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await startPhoneVerification(phone);
      setCodeSent(true);
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error) {
      console.error("Error sending verification code:", error);
      toast({
        title: "Failed to send verification code",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      toast({
        title: "Invalid verification code",
        description: "Please enter the 6-digit code sent to your phone",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await verifyPhone(phone, verificationCode);
      
      // Update user profile to mark phone as verified
      await refreshProfile();
      
      toast({
        title: "Phone verified successfully",
        description: "You can now participate in bid challenges",
      });
      
      navigate('/app/dashboard');
    } catch (error) {
      console.error("Error verifying code:", error);
      toast({
        title: "Failed to verify code",
        description: "Please check the code and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Verify Phone Number</CardTitle>
          <CardDescription>
            Phone verification is required to participate in bid challenges
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={codeSent}
            />
          </div>

          {!codeSent ? (
            <Button
              onClick={handleSendCode}
              disabled={isLoading}
              className="w-full bg-sport-purple hover:bg-sport-dark-purple"
            >
              {isLoading ? "Sending..." : "Send Verification Code"}
            </Button>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
              </div>

              <Button
                onClick={handleVerifyCode}
                disabled={isLoading}
                className="w-full bg-sport-purple hover:bg-sport-dark-purple"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </>
          )}
        </CardContent>
        
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => navigate('/app/dashboard')}
            className="w-full"
          >
            Skip for Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyPhone;
