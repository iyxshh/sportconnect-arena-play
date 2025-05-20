
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Auth = () => {
  const { user } = useAuth();
  
  // Redirect if already logged in
  if (user) {
    return <Navigate to="/app/dashboard" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-gradient-to-br from-sport-purple to-sport-dark-purple p-8 flex items-center justify-center">
          <div className="max-w-md text-white">
            <h1 className="text-4xl font-bold mb-4">SportConnect</h1>
            <p className="text-xl mb-8">
              Connect with sports enthusiasts, compete, and climb the ranks in your community.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl">🏆</div>
                <p className="mt-2 text-sm">Challenge Local Players</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl">🏅</div>
                <p className="mt-2 text-sm">Earn Rankings</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl">🤝</div>
                <p className="mt-2 text-sm">Build Your Network</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
