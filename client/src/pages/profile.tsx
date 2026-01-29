import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Calendar, LogOut, Save, Edit2, Shield, Award, BookOpen, TrendingUp, Trophy, Crown, Medal, Zap, Flame, Sparkles, Star, Target, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  // Fetch user's courses info (includes activity points, completed courses, badges)
  const { data: coursesInfoData, isLoading: coursesInfoLoading } = useQuery<{
    success: boolean;
    data: {
      userId: string;
      courses: Array<any>;
      activity: {
        totalPoints: number;
        dailyLoginStreak: number;
        lastLoginDate: string;
        pointsHistory: Array<any>;
      };
      badges: {
        totalBadges: number;
        completedCourses: number;
      };
    };
  }>({
    queryKey: ["/api/courses/info"],
    enabled: !!user,
    queryFn: async () => {
      const response = await fetch("/api/courses/info", {
        credentials: "include", // Include cookies for session-based auth
        headers: {
          "x-user-id": user?.userId || "",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch courses info");
      return response.json();
    },
    retry: false,
  });

  // Fetch leaderboard data
  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery<{
    success: boolean;
    data: Array<{
      rank: number;
      userId: string;
      name: string;
      email: string;
      activityPoints: number;
      completedCourses: number;
      dailyStreak: number;
    }>;
    total: number;
  }>({
    queryKey: ["/api/leaderboard"],
    queryFn: async () => {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return response.json();
    },
  });

  const leaderboard = leaderboardData?.data || [];
  const userRankEntry = leaderboard.find((entry) => entry.userId === user?.userId);

  // Extract stats from courses info
  const completedCourses = coursesInfoData?.data?.badges?.completedCourses || 0;
  const activityPoints = coursesInfoData?.data?.activity?.totalPoints || 0;
  const achievements = coursesInfoData?.data?.badges?.totalBadges || 0;

  if (!user) {
    return <></>;
  }

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const handleSave = () => {
    updateProfile({ name: editName, email: editEmail });
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Calculate user's rank percentage if available
  const rankPercentage = userRankEntry && leaderboard.length > 0
    ? Math.round(((leaderboard.length - userRankEntry.rank + 1) / leaderboard.length) * 100)
    : 0;

  return (
    <div className="flex flex-1">
        <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background via-muted/10 to-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Enhanced Header with Rank Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
            >
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent" data-testid="heading-profile">
                  My Profile
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage your account information and track your progress
                </p>
              </div>
              {userRankEntry && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-yellow-500/5 border border-yellow-500/20 shadow-lg"
                >
                  <div className="relative">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Global Rank</p>
                    <p className="text-lg font-bold text-foreground">#{userRankEntry.rank}</p>
                  </div>
                  {rankPercentage > 0 && (
                    <div className="pl-3 border-l border-yellow-500/30">
                      <p className="text-xs text-muted-foreground">Top {rankPercentage}%</p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Enhanced Profile Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-border/50 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm shadow-2xl overflow-hidden relative">
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <CardHeader className="pb-6 relative z-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                    >
                      <Avatar className="h-28 w-28 border-4 border-primary/30 shadow-xl ring-4 ring-primary/10">
                        <AvatarFallback className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground text-4xl font-bold shadow-lg">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <CardTitle className="text-3xl mb-1 font-bold" data-testid="text-user-name">{user.name}</CardTitle>
                        <CardDescription className="text-base flex items-center gap-2" data-testid="text-user-email">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 transition-colors">
                          <Shield className="h-3 w-3 mr-1.5" />
                          Verified Account
                        </Badge>
                        <Badge variant="outline" className="bg-muted/50 border-border hover:bg-muted transition-colors">
                          <Calendar className="h-3 w-3 mr-1.5" />
                          Joined {format(new Date(user.joinedDate), "MMM yyyy")}
                        </Badge>
                        {(coursesInfoData?.data?.activity?.dailyLoginStreak ?? 0) > 0 && (
                          <Badge variant="outline" className="bg-orange-500/10 border-orange-500/30 text-orange-600 hover:bg-orange-500/20 transition-colors">
                            <Flame className="h-3 w-3 mr-1.5" />
                            {coursesInfoData?.data?.activity?.dailyLoginStreak ?? 0} Day Streak
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <Separator className="my-0 relative z-10" />
                <CardContent className="pt-6 relative z-10">
                {isEditing ? (
                  <div className="space-y-6 p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        data-testid="input-edit-name"
                        className="h-12 text-base border-2 focus:border-primary transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        data-testid="input-edit-email"
                        className="h-12 text-base border-2 focus:border-primary transition-colors"
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
                      <Button 
                        onClick={handleSave} 
                        data-testid="button-save-profile" 
                        className="flex-1 h-11 group hover:scale-105 transition-transform"
                        size="lg"
                      >
                        <Save className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditName(user.name);
                          setEditEmail(user.email);
                        }}
                        data-testid="button-cancel-edit"
                        className="flex-1 h-11 hover:bg-muted transition-colors"
                        size="lg"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 hover:border-primary/40 transition-all cursor-default shadow-sm hover:shadow-md"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-md">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Full Name</p>
                          <p className="text-base font-bold text-foreground">{user.name}</p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-chart-1/10 via-chart-1/5 to-transparent border border-chart-1/20 hover:border-chart-1/40 transition-all cursor-default shadow-sm hover:shadow-md"
                      >
                        <div className="w-12 h-12 rounded-xl bg-chart-1/20 flex items-center justify-center flex-shrink-0 shadow-md">
                          <Mail className="h-6 w-6 text-chart-1" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Address</p>
                          <p className="text-base font-bold text-foreground break-all">{user.email}</p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-chart-4/10 via-chart-4/5 to-transparent border border-chart-4/20 hover:border-chart-4/40 transition-all cursor-default shadow-sm hover:shadow-md"
                      >
                        <div className="w-12 h-12 rounded-xl bg-chart-4/20 flex items-center justify-center flex-shrink-0 shadow-md">
                          <Calendar className="h-6 w-6 text-chart-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Member Since</p>
                          <p className="text-base font-bold text-foreground" data-testid="text-joined-date">
                            {format(new Date(user.joinedDate), "MMMM d, yyyy")}
                          </p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-green-500/20 hover:border-green-500/40 transition-all cursor-default shadow-sm hover:shadow-md"
                      >
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0 shadow-md">
                          <Shield className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Account Status</p>
                          <p className="text-base font-bold text-green-600">Active</p>
                        </div>
                      </motion.div>
                    </div>
                  )}
                  {!isEditing && (
                    <div className="mt-6 pt-6 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        data-testid="button-edit-profile"
                        className="w-full md:w-auto group hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <Edit2 className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                        Edit Profile Information
                      </Button>
                    </div>
                  )}
              </CardContent>
            </Card>
            </motion.div>

            {/* Enhanced Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid gap-6 md:grid-cols-3"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors" />
                  <CardContent className="pt-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <BookOpen className="h-7 w-7 text-primary" />
                      </div>
                      <Badge variant="outline" className="bg-primary/20 border-primary/40 text-primary font-bold text-base px-3 py-1">
                        {coursesInfoLoading ? "..." : completedCourses}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Courses Completed</p>
                    <p className="text-4xl font-extrabold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      {coursesInfoLoading ? "..." : completedCourses}
                    </p>
                    <div className="mt-4 pt-4 border-t border-primary/20">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Target className="h-3 w-3" />
                        <span>Keep learning to unlock more!</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-chart-1/30 bg-gradient-to-br from-chart-1/10 via-chart-1/5 to-chart-1/10 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-chart-1/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-chart-1/30 transition-colors" />
                  <CardContent className="pt-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-chart-1/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Zap className="h-7 w-7 text-chart-1" />
                      </div>
                      <Badge variant="outline" className="bg-chart-1/20 border-chart-1/40 text-chart-1 font-bold text-base px-3 py-1">
                        {coursesInfoLoading ? "..." : activityPoints}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Activity Points</p>
                    <p className="text-4xl font-extrabold bg-gradient-to-r from-chart-1 to-chart-1/60 bg-clip-text text-transparent">
                      {coursesInfoLoading ? "..." : activityPoints}
                    </p>
                    <div className="mt-4 pt-4 border-t border-chart-1/20">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="h-3 w-3" />
                        <span>Earned through learning activities</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-chart-4/30 bg-gradient-to-br from-chart-4/10 via-chart-4/5 to-chart-4/10 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-chart-4/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-chart-4/30 transition-colors" />
                  <CardContent className="pt-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-chart-4/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Award className="h-7 w-7 text-chart-4" />
                      </div>
                      <Badge variant="outline" className="bg-chart-4/20 border-chart-4/40 text-chart-4 font-bold text-base px-3 py-1">
                        {coursesInfoLoading ? "..." : achievements}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Achievements</p>
                    <p className="text-4xl font-extrabold bg-gradient-to-r from-chart-4 to-chart-4/60 bg-clip-text text-transparent">
                      {coursesInfoLoading ? "..." : achievements}
                    </p>
                    <div className="mt-4 pt-4 border-t border-chart-4/20">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Star className="h-3 w-3" />
                        <span>Unlock badges by completing courses</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Enhanced Leaderboard Section */}
            <div className="border-yellow-500/20 border-2 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6 ">
                <div className="flex items-center gap-2">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-yellow-500/10 flex items-center justify-center shadow-lg ring-2 ring-yellow-500/20">
                    <Trophy className="h-7 w-7 text-yellow-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
                    {leaderboard.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">{leaderboard.length} Students</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">Rankings based on activity points and course completions</p>
              </div>

              {userRankEntry && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">
                    Your Rank: #{userRankEntry.rank}
                  </p>
                </div>
              )}

              {leaderboardLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading leaderboard...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-2">No leaderboard data available</p>
                  <p className="text-sm text-gray-400">Start learning to appear on the leaderboard!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Enhanced Top 3 Podium */}
                  {leaderboard.slice(0, 3).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      {leaderboard.slice(0, 3).map((entry, index) => {
                        const isCurrentUser = entry.userId === user?.userId;
                        const isFirst = entry.rank === 1;
                        
                        return (
                          <div
                            key={entry.userId}
                            className={`relative overflow-hidden rounded-xl p-6 transition-all ${
                              isFirst
                                ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400 md:order-1'
                                : entry.rank === 2
                                ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-400 md:order-0'
                                : 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-400 md:order-2'
                            } ${isCurrentUser ? 'ring-4 ring-blue-500 ring-offset-2' : ''}`}
                          >
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                              {entry.rank === 1 && (
                                <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-yellow-600">
                                  <path d="M50 10 L61 39 L92 39 L67 58 L78 87 L50 68 L22 87 L33 58 L8 39 L39 39 Z" />
                                </svg>
                              )}
                              {entry.rank === 2 && (
                                <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-gray-600">
                                  <circle cx="50" cy="50" r="40" />
                                </svg>
                              )}
                              {entry.rank === 3 && (
                                <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-orange-600">
                                  <polygon points="50,10 90,90 10,90" />
                                </svg>
                              )}
                            </div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                              <div
                                className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-3 ${
                                  isFirst
                                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
                                    : entry.rank === 2
                                    ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                                    : 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                                }`}
                              >
                                {entry.name.charAt(0).toUpperCase()}
                              </div>

                              <h3 className="font-bold text-lg text-gray-900 mb-1">
                                {entry.name}
                              </h3>

                              {isCurrentUser && (
                                <span className="inline-block px-2 py-1 bg-blue-500 text-white text-xs rounded-full mb-2">
                                  You
                                </span>
                              )}

                              <p className="text-sm text-gray-600 mb-3">Rank #{entry.rank}</p>

                              <div className="w-full space-y-2">
                                <div className="bg-white bg-opacity-50 rounded-lg p-2">
                                  <p className="text-2xl font-bold text-gray-900">{entry.activityPoints}</p>
                                  <p className="text-xs text-gray-600">pts</p>
                                </div>
                                <div className="bg-white bg-opacity-50 rounded-lg p-2">
                                  <p className="text-sm font-semibold text-gray-900">
                                    {entry.completedCourses} {entry.completedCourses === 1 ? 'course' : 'courses'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Full Leaderboard List */}
                  <div className="max-h-[600px] overflow-y-auto space-y-2 pr-2">
                    {leaderboard.map((entry, index) => {
                      const isCurrentUser = entry.userId === user?.userId;
                      const isTop3 = entry.rank <= 3;

                      // Skip top 3 as they're already shown above
                      if (isTop3) return null;

                      return (
                        <div
                          key={entry.userId}
                          className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                            isCurrentUser
                              ? 'bg-blue-50 border-blue-300 shadow-md'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {/* Rank */}
                          <div className="flex-shrink-0 w-12 text-center">
                            <span className="text-lg font-bold text-gray-700">
                              #{entry.rank}
                            </span>
                          </div>

			                    {/* Avatar */}
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarFallback className={cn(
                              "text-sm font-bold",
                              isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                              {entry.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          {/* Name and Email */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {entry.name}
                              </h3>
                              {isCurrentUser && (
                                <span className="inline-block px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full flex-shrink-0">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">{entry.email}</p>
                          </div>

                          {/* Stats - Desktop */}
                          <div className="hidden md:flex items-center gap-6 flex-shrink-0">
                            <div className="text-center">
                              <p className="text-xs text-gray-500 mb-1">Points</p>
                              <p className="text-lg font-bold text-gray-900">{entry.activityPoints}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500 mb-1">Courses</p>
                              <p className="text-lg font-bold text-gray-900">{entry.completedCourses}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500 mb-1">Streak</p>
                              <p className="text-lg font-bold text-gray-900">{entry.dailyStreak}</p>
                            </div>
                          </div>

                          {/* Mobile Stats */}
                          <div className="flex md:hidden flex-col gap-1 flex-shrink-0 text-right">
                            <p className="text-sm font-semibold text-gray-900">{entry.activityPoints}</p>
                            <p className="text-xs text-gray-500">{entry.completedCourses} courses</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Account Actions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-destructive/40 bg-gradient-to-br from-destructive/10 via-destructive/5 to-destructive/10 shadow-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent pointer-events-none" />
                <CardHeader className="relative z-10 border-b border-destructive/20">
                  <CardTitle className="text-destructive flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-destructive" />
                    </div>
                    Account Actions
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Sign out of your account. You can sign back in anytime.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 relative z-10">
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout} 
                    data-testid="button-logout" 
                    className="w-full md:w-auto group hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
                    size="lg"
                  >
                    <LogOut className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
    </div>
  );
}
