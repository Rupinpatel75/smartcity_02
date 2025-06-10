import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { SiGoogle, SiApple, SiFacebook } from "react-icons/si";
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function Login() {
  const [location, navigate] = useLocation();
  const { login, loading: authLoading } = useAuth();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (!mobile.match(/^\d{10}$/)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    // Mock OTP sending - in real app this would call backend
    setOtpSent(true);
    setError(null);
    // Show success message that OTP is sent
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (loginMethod === "otp") {
        if (otp !== "1234") {
          throw new Error("Invalid OTP. Use 1234 for testing.");
        }
        // For OTP login, we'll need to find user by mobile and authenticate
        const response = await fetch("/api/v1/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile, otp }),
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Login failed");
        }
        
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          navigate("/dashboard");
        }
      } else {
        // Password login - convert mobile to email format for now
        await login(`${mobile}@mobile.com`, password);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background/50 to-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
              <svg
                className="w-8 h-8 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="otp">OTP</TabsTrigger>
            </TabsList>
            
            <TabsContent value="password">
              <form className="space-y-4" onSubmit={(e) => { setLoginMethod("password"); handleLogin(e); }}>
                <div>
                  <Label>Mobile Number</Label>
                  <Input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    className="w-full"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Password"
                    className="w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="text-right">
                  <Link href="/forgot-password">
                    <a className="text-sm text-gray-600 hover:text-gray-900">
                      Forgot Password?
                    </a>
                  </Link>
                </div>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Login with Password"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="otp">
              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <Label>Mobile Number</Label>
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      className="flex-1"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                    <Button 
                      type="button" 
                      onClick={sendOTP} 
                      disabled={otpSent || mobile.length !== 10}
                      variant="outline"
                    >
                      {otpSent ? "Sent" : "Send OTP"}
                    </Button>
                  </div>
                </div>
                
                {otpSent && (
                  <div>
                    <Label>Enter OTP</Label>
                    <Input
                      type="text"
                      placeholder="Enter OTP (default: 1234)"
                      className="w-full"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      For testing, use OTP: 1234
                    </p>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  type="submit" 
                  disabled={loading || !otpSent || !otp}
                  onClick={() => setLoginMethod("otp")}
                >
                  {loading ? "Verifying..." : "Login with OTP"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-gray-500">
            <span>-or-</span>
          </div>

          <div className="mt-6 space-y-3">
            <Button variant="outline" className="w-full">
              <SiGoogle className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full">
              <SiApple className="mr-2 h-4 w-4" />
              Continue with Apple
            </Button>
            <Button variant="outline" className="w-full">
              <SiFacebook className="mr-2 h-4 w-4" />
              Continue with Facebook
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link href="/signup">
              <a className="text-primary hover:underline">Signup</a>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}