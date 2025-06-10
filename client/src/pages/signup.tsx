import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Signup() {
    const [location, navigate] = useLocation(); // ✅ Correct Wouter navigation
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [otp, setOtp] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [state, setState] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

  const sendOTP = () => {
    // Mock OTP sending
    alert("OTP sent to your phone");
  };

  const verifyOTP = () => {
    // Mock OTP verification
    if (otp === "1234") {
      setPhoneVerified(true);
      alert("Phone verified successfully!");
    } else {
      alert("Invalid OTP");
    }
  };


  const validateForm = () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (!phone.match(/^\d{10}$/)) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/v1/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          state,
          district,
          city,
          phone_no:Number(phone),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      alert("Signup successful!");
      navigate("/login"); // ✅ Redirect to Login
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

          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <Label>Username</Label>
              <Input
                type="text"
                placeholder="Username"
                className="w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Email"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <div>
              <Label>State</Label>
              <Select onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>District</Label>
              <Input
                type="text"
                placeholder="District"
                className="w-full"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                type="text"
                placeholder="City"
                className="w-full"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Phone number"
                  className="w-full"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={phoneVerified}
                  required
                />
                <Button type="button" onClick={sendOTP} disabled={phoneVerified}>
                  Send OTP
                </Button>
              </div>
            </div>
            {!phoneVerified && (
              <div>
                <Label>OTP</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Button type="button" onClick={verifyOTP}>
                    Verify
                  </Button>
                </div>
              </div>
            )}
            <Button className="w-full" type="submit" disabled={!phoneVerified || loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
