"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Store,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    {
      role: "Admin",
      email: "admin@example.com",
      password: "admin123",
      description: "Full access to admin dashboard and analytics",
      color: "bg-red-100 text-red-800",
    },
    {
      role: "Seller",
      email: "seller@example.com",
      password: "seller123",
      description: "Manage products and view seller analytics",
      color: "bg-blue-100 text-blue-800",
    },
    {
      role: "Customer",
      email: "customer@example.com",
      password: "customer123",
      description: "Browse marketplace and make purchases",
      color: "bg-green-100 text-green-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Demo Accounts */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">SocialFlow</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to the Marketplace</h1>
            <p className="text-muted-foreground">
              Experience our comprehensive e-commerce platform with AI-powered content generation and 3D galleries.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="h-5 w-5" />
                <span>Demo Accounts</span>
              </CardTitle>
              <CardDescription>
                Try different user roles to explore all features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {demoAccounts.map((account, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className={account.color}>{account.role}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEmail(account.email);
                        setPassword(account.password);
                      }}
                    >
                      Use This Account
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{account.description}</p>
                  <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                    <div>Email: {account.email}</div>
                    <div>Password: {account.password}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium">🛍️ Marketplace</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Browse and search products</li>
                  <li>• Detailed product pages with reviews</li>
                  <li>• Shopping cart and checkout</li>
                  <li>• Order tracking and management</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">🤖 AI Content Generation</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Gemini-powered content creation</li>
                  <li>• Image-to-content generation</li>
                  <li>• Multi-platform content (X, LinkedIn, Instagram)</li>
                  <li>• Content scheduling and analytics</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">🎨 3D Virtual Galleries</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Immersive 3D gallery experience</li>
                  <li>• Custom gallery creation</li>
                  <li>• Interactive navigation</li>
                  <li>• VR support capabilities</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="space-y-3">
                <h4 className="font-medium text-center">Quick Access</h4>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEmail("admin@example.com");
                      setPassword("admin123");
                    }}
                  >
                    Admin Access
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEmail("seller@example.com");
                      setPassword("seller123");
                    }}
                  >
                    Seller Access
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEmail("customer@example.com");
                      setPassword("customer123");
                    }}
                  >
                    Customer Access
                  </Button>
                </div>
              </div>

              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Demo Mode</p>
                    <p>Use any of the demo accounts above to explore different user roles and features.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
