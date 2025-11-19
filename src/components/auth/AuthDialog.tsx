import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

interface AuthDialogProps {
  children: React.ReactNode;
  defaultMode?: 'login' | 'signup';
}

export const AuthDialog: React.FC<AuthDialogProps> = ({ children, defaultMode = 'login' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    university: '',
    major: 'Engineering',
    graduationYear: ''
  });
  
  const { login, signup, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        toast.success("Welcome back!");
      } else {
        if (!formData.name.trim()) {
          toast.error("Name is required");
          return;
        }
        await signup(formData);
        toast.success("Account created successfully!");
      }
      
      setIsOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        university: '',
        major: 'Engineering',
        graduationYear: ''
      });
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Handle specific Supabase errors
      let errorMessage = 'Authentication failed';
      if (error.message?.includes('already registered') || error.message?.includes('already been registered')) {
        errorMessage = 'Email is already registered';
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = 'Password is too weak';
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Invalid email address';
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account';
      } else if (error.message?.includes('User not found')) {
        errorMessage = 'No account found with this email';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from(
    { length: 8 }, 
    (_, i) => currentYear + i
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? 'Welcome Back' : 'Join Vectorly'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login' 
              ? 'Sign in to continue your interview prep journey' 
              : 'Start your engineering interview preparation'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    placeholder="MIT, Stanford..."
                    value={formData.university}
                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Graduation Year</Label>
                  <Select 
                    value={formData.graduationYear} 
                    onValueChange={(value) => setFormData({...formData, graduationYear: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {graduationYears.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="major">Major</Label>
                <Select 
                  value={formData.major} 
                  onValueChange={(value) => setFormData({...formData, major: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Aerospace Engineering">Aerospace Engineering</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    <SelectItem value="Chemical Engineering">Chemical Engineering</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Other Engineering">Other Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@university.edu"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
        
        <div className="text-center text-sm">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={() => setMode('signup')}
              >
                Sign up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={() => setMode('login')}
              >
                Sign in
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};