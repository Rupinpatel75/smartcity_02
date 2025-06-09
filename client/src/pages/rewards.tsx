
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";

interface Reward {
  id: number;
  title: string;
  points: number;
  image: string;
}

const mockRewards: Reward[] = [
  {
    id: 1,
    title: "Free Bus Pass",
    points: 100,
    image: "https://placehold.co/200x200",
  },
  {
    id: 2,
    title: "Movie Tickets",
    points: 150,
    image: "https://placehold.co/200x200",
  },
  {
    id: 3,
    title: "Shopping Voucher",
    points: 200,
    image: "https://placehold.co/200x200",
  },
  {
    id: 4,
    title: "Restaurant Coupon",
    points: 250,
    image: "https://placehold.co/200x200",
  },
];

export default function Rewards() {
  const { data: userPoints } = useQuery({
    queryKey: ["/api/user/points"],
    queryFn: () => ({ total: 10, last: 5 }),
  });

  const { data: rewards = mockRewards } = useQuery({
    queryKey: ["/api/rewards"],
  });

  if (!userPoints) return null;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2">Rewards</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Earn points by taking responsible actions and redeem rewards!
        </p>
      </div>

      <div className="space-y-4 md:space-y-0 md:grid md:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold">{userPoints.total}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">Last Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold">{userPoints.last}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">Your Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Badge variant="secondary" className="mr-2">
                  +5
                </Badge>
                Submitted a case report
              </li>
              <li className="flex items-center text-sm">
                <Badge variant="secondary" className="mr-2">
                  +5
                </Badge>
                Helped verify a report
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg md:text-xl font-semibold mb-4">Available Rewards</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rewards.map((reward) => (
          <Card key={reward.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="aspect-square rounded-lg bg-muted mb-3 flex items-center justify-center">
                <Gift className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-2">{reward.title}</h3>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs md:text-sm">
                  {reward.points} points
                </Badge>
                <button
                  className="text-xs md:text-sm text-primary hover:underline disabled:opacity-50 disabled:no-underline"
                  disabled={userPoints.total < reward.points}
                >
                  Redeem
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
