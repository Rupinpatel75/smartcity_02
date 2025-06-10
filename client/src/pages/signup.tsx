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
    if (!username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!email.includes('@')) {
      setError("Please enter a valid email address");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (!phone.match(/^\d{10}$/)) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!phoneVerified) {
      setError("Please verify your phone number first");
      return false;
    }
    if (!state) {
      setError("Please select a state");
      return false;
    }
    if (!city) {
      setError("Please select a city");
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
      console.log("Submitting signup data:", {
        username,
        email,
        phoneNo: phone,
        state: "gujarat",
        city
      });

      const response = await fetch("/api/v1/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          state: "gujarat",
          district: city,
          city,
          phoneNo: phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Network error occurred" }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      alert("Signup successful! Please login with your credentials.");
      navigate("/login");
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError("Network connection failed. Please check your internet connection and try again.");
      } else {
        setError(err.message || "Signup failed. Please try again.");
      }
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
              <Select onValueChange={setState} value={state}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>City</Label>
              <Select onValueChange={setCity} value={city}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                  <SelectItem value="surat">Surat</SelectItem>
                  <SelectItem value="vadodara">Vadodara</SelectItem>
                  <SelectItem value="rajkot">Rajkot</SelectItem>
                  <SelectItem value="bhavnagar">Bhavnagar</SelectItem>
                  <SelectItem value="jamnagar">Jamnagar</SelectItem>
                  <SelectItem value="junagadh">Junagadh</SelectItem>
                  <SelectItem value="gandhinagar">Gandhinagar</SelectItem>
                  <SelectItem value="anand">Anand</SelectItem>
                  <SelectItem value="morbi">Morbi</SelectItem>
                  <SelectItem value="nadiad">Nadiad</SelectItem>
                  <SelectItem value="surendranagar">Surendranagar</SelectItem>
                  <SelectItem value="bharuch">Bharuch</SelectItem>
                  <SelectItem value="mehsana">Mehsana</SelectItem>
                  <SelectItem value="bhuj">Bhuj</SelectItem>
                  <SelectItem value="porbandar">Porbandar</SelectItem>
                  <SelectItem value="palanpur">Palanpur</SelectItem>
                  <SelectItem value="valsad">Valsad</SelectItem>
                  <SelectItem value="vapi">Vapi</SelectItem>
                  <SelectItem value="veraval">Veraval</SelectItem>
                  <SelectItem value="godhra">Godhra</SelectItem>
                  <SelectItem value="patan">Patan</SelectItem>
                  <SelectItem value="kalol">Kalol</SelectItem>
                  <SelectItem value="dahod">Dahod</SelectItem>
                  <SelectItem value="botad">Botad</SelectItem>
                  <SelectItem value="amreli">Amreli</SelectItem>
                  <SelectItem value="deesa">Deesa</SelectItem>
                  <SelectItem value="jetpur">Jetpur</SelectItem>
                  <SelectItem value="sidhpur">Sidhpur</SelectItem>
                  <SelectItem value="wankaner">Wankaner</SelectItem>
                  <SelectItem value="padra">Padra</SelectItem>
                  <SelectItem value="mangrol">Mangrol</SelectItem>
                  <SelectItem value="visnagar">Visnagar</SelectItem>
                  <SelectItem value="upleta">Upleta</SelectItem>
                  <SelectItem value="una">Una</SelectItem>
                  <SelectItem value="talaja">Talaja</SelectItem>
                  <SelectItem value="mahuva">Mahuva</SelectItem>
                  <SelectItem value="modasa">Modasa</SelectItem>
                  <SelectItem value="lunawada">Lunawada</SelectItem>
                  <SelectItem value="thangadh">Thangadh</SelectItem>
                  <SelectItem value="vyara">Vyara</SelectItem>
                  <SelectItem value="mandvi">Mandvi</SelectItem>
                  <SelectItem value="petlad">Petlad</SelectItem>
                  <SelectItem value="kapadvanj">Kapadvanj</SelectItem>
                  <SelectItem value="umreth">Umreth</SelectItem>
                  <SelectItem value="dholka">Dholka</SelectItem>
                  <SelectItem value="disa">Disa</SelectItem>
                  <SelectItem value="salaya">Salaya</SelectItem>
                  <SelectItem value="limbdi">Limbdi</SelectItem>
                  <SelectItem value="dhrangadhra">Dhrangadhra</SelectItem>
                  <SelectItem value="rajula">Rajula</SelectItem>
                  <SelectItem value="morvi">Morvi</SelectItem>
                  <SelectItem value="wadhwan">Wadhwan</SelectItem>
                  <SelectItem value="chotila">Chotila</SelectItem>
                  <SelectItem value="halvad">Halvad</SelectItem>
                  <SelectItem value="dhrol">Dhrol</SelectItem>
                  <SelectItem value="jam_khambhaliya">Jam Khambhaliya</SelectItem>
                  <SelectItem value="okha">Okha</SelectItem>
                  <SelectItem value="dwarka">Dwarka</SelectItem>
                  <SelectItem value="khambhalia">Khambhalia</SelectItem>
                  <SelectItem value="sikka">Sikka</SelectItem>
                  <SelectItem value="kalyanpur">Kalyanpur</SelectItem>
                  <SelectItem value="ranavav">Ranavav</SelectItem>
                  <SelectItem value="bhanvad">Bhanvad</SelectItem>
                  <SelectItem value="lalpur">Lalpur</SelectItem>
                  <SelectItem value="jodiya">Jodiya</SelectItem>
                  <SelectItem value="khambhat">Khambhat</SelectItem>
                  <SelectItem value="dhandhuka">Dhandhuka</SelectItem>
                  <SelectItem value="bavla">Bavla</SelectItem>
                  <SelectItem value="daskroi">Daskroi</SelectItem>
                  <SelectItem value="sanand">Sanand</SelectItem>
                  <SelectItem value="viramgam">Viramgam</SelectItem>
                  <SelectItem value="dehgam">Dehgam</SelectItem>
                  <SelectItem value="mandal">Mandal</SelectItem>
                  <SelectItem value="mansa">Mansa</SelectItem>
                  <SelectItem value="radhanpur">Radhanpur</SelectItem>
                  <SelectItem value="vadgam">Vadgam</SelectItem>
                  <SelectItem value="tharad">Tharad</SelectItem>
                  <SelectItem value="dhanera">Dhanera</SelectItem>
                  <SelectItem value="bhabhar">Bhabhar</SelectItem>
                  <SelectItem value="vav">Vav</SelectItem>
                  <SelectItem value="kankrej">Kankrej</SelectItem>
                  <SelectItem value="dantiwada">Dantiwada</SelectItem>
                  <SelectItem value="amirgadh">Amirgadh</SelectItem>
                  <SelectItem value="sami">Sami</SelectItem>
                  <SelectItem value="harij">Harij</SelectItem>
                  <SelectItem value="chanasma">Chanasma</SelectItem>
                  <SelectItem value="kadi">Kadi</SelectItem>
                  <SelectItem value="unjha">Unjha</SelectItem>
                  <SelectItem value="siddhpur">Siddhpur</SelectItem>
                  <SelectItem value="becharaji">Becharaji</SelectItem>
                  <SelectItem value="kheralu">Kheralu</SelectItem>
                  <SelectItem value="vadnagar">Vadnagar</SelectItem>
                  <SelectItem value="himmatnagar">Himmatnagar</SelectItem>
                  <SelectItem value="idar">Idar</SelectItem>
                  <SelectItem value="talod">Talod</SelectItem>
                  <SelectItem value="bayad">Bayad</SelectItem>
                  <SelectItem value="prantij">Prantij</SelectItem>
                  <SelectItem value="dhansura">Dhansura</SelectItem>
                  <SelectItem value="malpur">Malpur</SelectItem>
                  <SelectItem value="meghraj">Meghraj</SelectItem>
                </SelectContent>
              </Select>
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
