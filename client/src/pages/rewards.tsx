
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { 
  Gift, 
  Award, 
  Star, 
  Ticket, 
  Car, 
  ShoppingBag, 
  Coffee,
  Utensils,
  Smartphone,
  Trophy,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Reward {
  id: number;
  title: string;
  description: string;
  points: number;
  category: string;
  icon: string;
  available: boolean;
}

const cityRewards: Reward[] = [
  {
    id: 1,
    title: "Public Transport Pass",
    description: "1-month free bus pass for city transport",
    points: 100,
    category: "Transport",
    icon: "Car",
    available: true,
  },
  {
    id: 2,
    title: "Cinema Tickets",
    description: "2 movie tickets for weekend shows",
    points: 150,
    category: "Entertainment",
    icon: "Ticket",
    available: true,
  },
  {
    id: 3,
    title: "Shopping Voucher",
    description: "₹500 voucher for local shopping centers",
    points: 200,
    category: "Shopping",
    icon: "ShoppingBag",
    available: true,
  },
  {
    id: 4,
    title: "Restaurant Meal",
    description: "Free meal for two at partner restaurants",
    points: 250,
    category: "Food",
    icon: "Utensils",
    available: true,
  },
  {
    id: 5,
    title: "Coffee Shop Credits",
    description: "₹300 credits at local coffee shops",
    points: 120,
    category: "Food",
    icon: "Coffee",
    available: true,
  },
  {
    id: 6,
    title: "Mobile Recharge",
    description: "₹200 mobile recharge voucher",
    points: 80,
    category: "Utility",
    icon: "Smartphone",
    available: true,
  },
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Car": return Car;
    case "Ticket": return Ticket;
    case "ShoppingBag": return ShoppingBag;
    case "Utensils": return Utensils;
    case "Coffee": return Coffee;
    case "Smartphone": return Smartphone;
    default: return Gift;
  }
};

export default function Rewards() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userProfile } = useQuery({
    queryKey: ["/api/v1/user/me"],
    enabled: !!user,
  });

  const currentPoints = userProfile?.points || 0;

  const redeemReward = useMutation({
    mutationFn: async (rewardId: number) => {
      // This would be an API call to redeem a reward
      return { success: true, rewardId };
    },
    onSuccess: (data) => {
      toast({
        title: "Reward Redeemed!",
        description: "Your reward will be processed within 24 hours.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/user/me"] });
    },
    onError: () => {
      toast({
        title: "Redemption Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleRedeem = (reward: Reward) => {
    if (currentPoints >= reward.points) {
      redeemReward.mutate(reward.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Rewards Center
          </h1>
          <p className="text-gray-600">
            Earn points by reporting infrastructure issues and redeem them for exciting rewards!
          </p>
        </div>

        {/* Points Overview - Mobile First Design */}
        <div className="mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Available Points</p>
                    <p className="text-3xl sm:text-4xl font-bold">{currentPoints}</p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-white/80 text-sm mb-2">How to Earn Points</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span>Report Issue: +10 points</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Verified Report: +15 points</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Filter - Mobile Responsive */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {["All", "Transport", "Entertainment", "Shopping", "Food", "Utility"].map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Rewards Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {cityRewards.map((reward) => {
            const IconComponent = getIcon(reward.icon);
            const canRedeem = currentPoints >= reward.points;
            
            return (
              <Card key={reward.id} className={`transition-all duration-200 hover:shadow-lg ${!canRedeem ? 'opacity-75' : ''}`}>
                <CardContent className="p-4 sm:p-6">
                  {/* Reward Icon */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    canRedeem 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <IconComponent className="w-8 h-8" />
                  </div>

                  {/* Reward Info */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {reward.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {reward.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {reward.category}
                    </Badge>
                  </div>

                  {/* Points and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-900">
                        {reward.points} pts
                      </span>
                    </div>
                    <Button
                      size="sm"
                      disabled={!canRedeem || redeemReward.isPending}
                      onClick={() => handleRedeem(reward)}
                      className={`${
                        canRedeem 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {redeemReward.isPending ? 'Redeeming...' : 'Redeem'}
                    </Button>
                  </div>

                  {/* Insufficient Points Warning */}
                  {!canRedeem && (
                    <div className="mt-3 p-2 bg-orange-50 rounded-lg">
                      <p className="text-xs text-orange-700">
                        Need {reward.points - currentPoints} more points
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Info Section */}
        <div className="mt-8 sm:mt-12">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Want More Points?
                </h3>
                <p className="text-gray-600 mb-4">
                  Keep contributing to your community by reporting infrastructure issues and helping make your city better!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <a href="/report">Report New Issue</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/map">View Community Map</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
