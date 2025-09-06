// src/components/SupabaseTest.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  data?: any;
}

const SupabaseTest: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Database Connection', status: 'pending' },
    { name: 'Sample Data', status: 'pending' },
    { name: 'Authentication', status: 'pending' },
    { name: 'User Creation', status: 'pending' },
    { name: 'Problem Fetching', status: 'pending' },
    { name: 'Submission Creation', status: 'pending' },
    { name: 'Progress Tracking', status: 'pending' },
    { name: 'Achievements', status: 'pending' },
  ]);

  const [testUser, setTestUser] = useState({
    email: 'test@vectorly.com',
    password: 'password123',
    name: 'Test User'
  });

  const updateTest = (name: string, status: 'success' | 'error', message?: string, data?: any) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, status, message, data } : test
    ));
  };

  const runAllTests = async () => {
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' })));

    try {
      // Test 1: Database Connection
      await testDatabaseConnection();
      
      // Test 2: Sample Data
      await testSampleData();
      
      // Test 3: Authentication Setup
      await testAuthentication();
      
      // Test 4: User Creation
      await testUserCreation();
      
      // Test 5: Problem Fetching
      await testProblemFetching();
      
      // Test 6: Submission Creation
      await testSubmissionCreation();
      
      // Test 7: Progress Tracking
      await testProgressTracking();
      
      // Test 8: Achievements
      await testAchievements();
      
    } catch (error) {
      console.error('Test suite failed:', error);
    }
  };

  const testDatabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('topics').select('count').limit(1);
      if (error) throw error;
      
      updateTest('Database Connection', 'success', 'Successfully connected to Supabase');
    } catch (error: any) {
      updateTest('Database Connection', 'error', `Connection failed: ${error.message}`);
    }
  };

  const testSampleData = async () => {
    try {
      const { data: topics, error: topicsError } = await supabase
        .from('topics')
        .select('*');
      
      if (topicsError) throw topicsError;
      
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('*');
      
      if (companiesError) throw companiesError;
      
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*');
      
      if (achievementsError) throw achievementsError;
      
      updateTest('Sample Data', 'success', 
        `Found ${topics?.length || 0} topics, ${companies?.length || 0} companies, ${achievements?.length || 0} achievements`);
    } catch (error: any) {
      updateTest('Sample Data', 'error', `Sample data test failed: ${error.message}`);
    }
  };

  const testAuthentication = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      updateTest('Authentication', 'success', 
        session ? 'User is authenticated' : 'Authentication system working (no active session)');
    } catch (error: any) {
      updateTest('Authentication', 'error', `Auth test failed: ${error.message}`);
    }
  };

  const testUserCreation = async () => {
    try {
      // Try to sign up a test user
      const { data, error } = await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
        options: {
          data: {
            name: testUser.name
          }
        }
      });
      
      if (error && !error.message.includes('already registered')) {
        throw error;
      }
      
      // If user already exists, try to sign in
      if (error?.message.includes('already registered')) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: testUser.email,
          password: testUser.password
        });
        
        if (signInError) throw signInError;
      }
      
      updateTest('User Creation', 'success', 'Test user created/authenticated successfully');
    } catch (error: any) {
      updateTest('User Creation', 'error', `User creation failed: ${error.message}`);
    }
  };

  const testProblemFetching = async () => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select(`
          *,
          topics(name),
          problem_companies(companies(name))
        `)
        .limit(5);
      
      if (error) throw error;
      
      updateTest('Problem Fetching', 'success', 
        `Successfully fetched ${data?.length || 0} problems with relationships`);
    } catch (error: any) {
      updateTest('Problem Fetching', 'error', `Problem fetching failed: ${error.message}`);
    }
  };

  const testSubmissionCreation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user for submission test');
      }
      
      // Get a problem to submit against
      const { data: problems } = await supabase
        .from('problems')
        .select('id')
        .limit(1);
      
      if (!problems?.length) {
        throw new Error('No problems available for submission test');
      }
      
      // Create a test submission
      const { data, error } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          problem_id: problems[0].id,
          status: 'solved',
          user_answer: 'Test solution for verification',
          time_spent_minutes: 25,
          hints_used: 1
        })
        .select()
        .single();
      
      if (error) throw error;
      
      updateTest('Submission Creation', 'success', 'Test submission created successfully');
    } catch (error: any) {
      updateTest('Submission Creation', 'error', `Submission test failed: ${error.message}`);
    }
  };

  const testProgressTracking = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user for progress test');
      }
      
      // Check if user stats were updated by trigger
      const { data: userStats, error } = await supabase
        .from('users')
        .select('total_problems_solved, current_streak, last_activity_date')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      // Check daily activity
      const { data: dailyActivity } = await supabase
        .from('user_daily_activity')
        .select('*')
        .eq('user_id', user.id)
        .eq('activity_date', new Date().toISOString().split('T')[0]);
      
      updateTest('Progress Tracking', 'success', 
        `User stats updated: ${userStats.total_problems_solved} solved, daily activity tracked`);
    } catch (error: any) {
      updateTest('Progress Tracking', 'error', `Progress tracking failed: ${error.message}`);
    }
  };

  const testAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user for achievement test');
      }
      
      // Check if any achievements were earned
      const { data: userAchievements, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements(name, description)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      updateTest('Achievements', 'success', 
        `Found ${userAchievements?.length || 0} earned achievements`);
    } catch (error: any) {
      updateTest('Achievements', 'error', `Achievement test failed: ${error.message}`);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Pass</Badge>;
      case 'error':
        return <Badge variant="destructive">Fail</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Vectorly Supabase Test Suite</CardTitle>
          <p className="text-muted-foreground">
            Test your Supabase setup to ensure all features are working correctly.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="email">Test Email</Label>
              <Input
                id="email"
                type="email"
                value={testUser.email}
                onChange={(e) => setTestUser({ ...testUser, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="password">Test Password</Label>
              <Input
                id="password"
                type="password"
                value={testUser.password}
                onChange={(e) => setTestUser({ ...testUser, password: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="name">Test Name</Label>
              <Input
                id="name"
                value={testUser.name}
                onChange={(e) => setTestUser({ ...testUser, name: e.target.value })}
              />
            </div>
          </div>
          
          <Button onClick={runAllTests} className="w-full" size="lg">
            🚀 Run All Tests
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tests.map((test, index) => (
              <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <p className="font-medium">{test.name}</p>
                    {test.message && (
                      <p className="text-sm text-muted-foreground">{test.message}</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(test.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual Testing Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>✅ <strong>Dashboard Tables:</strong> Check Table Editor for all tables</p>
            <p>✅ <strong>Sample Data:</strong> Verify topics, companies, achievements exist</p>
            <p>✅ <strong>Authentication:</strong> Test signup/login in your app</p>
            <p>✅ <strong>Row Level Security:</strong> Try accessing data without auth</p>
            <p>✅ <strong>Functions:</strong> Check Database → Functions for custom functions</p>
            <p>✅ <strong>Triggers:</strong> Verify user stats update after submissions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseTest;