"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Loader2, RefreshCw } from "lucide-react";

interface Recommendation {
  category: string;
  tip: string;
  potentialSavings: number;
}

export default function MoneySavingRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      console.log("Fetching recommendations with token:", token);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/recommendations`,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      const data = await response.json();
      console.log("Recommendations received:", data);
      setRecommendations(data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <p className="text-center text-red-500">Error: {error}</p>
          <Button onClick={fetchRecommendations} className="mt-4 mx-auto block">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Money Saving Recommendations
          <Button variant="ghost" size="default" onClick={fetchRecommendations}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>Based on your recent spending habits</CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <p className="text-center text-gray-500">
            No recommendations available at this time. Try adding more
            transactions to get personalized tips.
          </p>
        ) : (
          <ul className="space-y-4">
            {recommendations.map((rec, index) => (
              <li key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{rec.category}</h3>
                <p className="text-gray-700 mb-2">{rec.tip}</p>
                <p className="text-green-600 font-medium">
                  Potential savings: ${rec.potentialSavings.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
