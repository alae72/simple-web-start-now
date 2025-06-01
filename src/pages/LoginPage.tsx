
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the schema for the login form
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Mock user database with roles (default users)
const defaultUsers = [
  { username: "admin", password: "password123", role: "admin", name: "Admin User" },
  { username: "staff", password: "password123", role: "staff", name: "Staff User" },
  { username: "user", password: "password123", role: "user", name: "Regular User" },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Define the form with React Hook Form and Zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    
    // Mock authentication - Find user in both default users and admin-created users
    setTimeout(() => {
      setIsLoading(false);
      
      // Get users created through admin panel
      const savedUsers = localStorage.getItem('martilhaven_users');
      const adminCreatedUsers = savedUsers ? JSON.parse(savedUsers) : [];
      
      // Combine default users with admin-created users
      const allUsers = [...defaultUsers, ...adminCreatedUsers];
      
      // Find user by username first
      const userByUsername = allUsers.find(u => u.username === data.username);
      
      // If no username match, try email for admin-created users
      const userByEmail = adminCreatedUsers.find(u => u.email === data.username);
      
      const user = userByUsername || userByEmail;
      
      if (user && user.password === data.password) {
        // Store user authentication data
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", user.name);
        localStorage.setItem("loginMethod", "credentials");
        
        // Role-based navigation
        switch (user.role) {
          case "admin":
            toast({
              title: "Admin login successful",
              description: `Welcome back, ${user.name}!`,
            });
            navigate("/admin");
            break;
          case "staff":
            toast({
              title: "Staff login successful",
              description: `Welcome back, ${user.name}!`,
            });
            navigate("/staff");
            break;
          case "customer":
          case "user":
            toast({
              title: "Login successful",
              description: `Welcome back, ${user.name}!`,
            });
            navigate("/");
            break;
          default:
            toast({
              title: "Login successful",
              description: `Welcome back, ${user.name}!`,
            });
            navigate("/");
        }
      } else {
        // Invalid credentials
        toast({
          title: "Login failed",
          description: "Invalid username or password. Please try again.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="bg-moroccan-blue text-white p-2 rounded">
              <span className="font-serif text-lg">M</span>
            </div>
            <div className="font-serif text-xl text-moroccan-blue">
              <span>Martil</span>
              <span className="text-moroccan-gold">Haven</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Login to Your Account</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username or email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-moroccan-blue hover:bg-moroccan-blue/90"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Demo credentials:<br />
            <span className="font-medium">Admin:</span> admin / password123<br />
            <span className="font-medium">Staff:</span> staff / password123<br />
            <span className="font-medium">User:</span> user / password123<br />
            <span className="text-xs mt-2 block">Or use any user created through admin panel</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
