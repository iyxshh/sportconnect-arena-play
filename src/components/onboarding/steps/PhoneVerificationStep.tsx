
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { OnboardingData } from "../OnboardingFlow";
import { startPhoneVerification, verifyPhone } from "@/lib/supabase/client";

const PhoneVerificationStep = ({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}) => {
  const [phone, setPhone] = useState(data.phone || "");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      updateData({ phone });
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
      updateData({ phoneVerified: true });
      toast({
        title: "Phone verified successfully",
        description: "Your phone number has been verified",
      });
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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Phone Verification</h2>
        <p className="text-muted-foreground">
          Verify your phone number to participate in bid challenges (optional)
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={codeSent || data.phoneVerified}
          />
        </div>

        {!data.phoneVerified && !codeSent && (
          <Button
            onClick={handleSendCode}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </Button>
        )}

        {!data.phoneVerified && codeSent && (
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
              className="w-full"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          </>
        )}

        {data.phoneVerified && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mr-3">
              ✓
            </div>
            <div>
              <p className="font-medium text-green-800">Phone Verified</p>
              <p className="text-green-600 text-sm">{phone}</p>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Phone verification is optional but required for bid challenges. <br />
          You can skip this step and verify later.
        </p>
      </div>
    </div>
  );
};

export default PhoneVerificationStep;
