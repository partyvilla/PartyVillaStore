"use client"

import { useState, useEffect } from 'react'

// This is a client component wrapper that displays admin setup info
export default function AdminSetupInfo() {
  const [setupInfo, setSetupInfo] = useState<{
    status: 'loading' | 'error' | 'users-exist' | 'no-users';
    message: string;
    count?: number;
  }>({
    status: 'loading',
    message: 'Checking admin users...'
  });

  useEffect(() => {
    async function fetchAdminStatus() {
      try {
        // Fetch admin status from an API route
        const response = await fetch('/api/admin/check-users');
        const data = await response.json();
        
        if (data.error) {
          setSetupInfo({
            status: 'error',
            message: data.error
          });
          return;
        }
        
        if (data.userCount > 0) {
          setSetupInfo({
            status: 'users-exist',
            message: 'Users already exist in the system.',
            count: data.userCount
          });
        } else {
          setSetupInfo({
            status: 'no-users',
            message: 'No users found. Create an admin account to get started.'
          });
        }
      } catch (error) {
        setSetupInfo({
          status: 'error',
          message: error instanceof Error ? error.message : 'Failed to check users'
        });
      }
    }
    
    fetchAdminStatus();
  }, []);

  if (setupInfo.status === 'loading') {
    return (
      <div className="p-4 bg-gray-50 rounded-md animate-pulse">
        <p>Loading admin user information...</p>
      </div>
    );
  }

  if (setupInfo.status === 'error') {
    return (
      <div className="p-4 bg-red-50 rounded-md">
        <h1 className="text-xl font-bold text-red-600">Error checking users</h1>
        <p>{setupInfo.message}</p>
      </div>
    );
  }

  if (setupInfo.status === 'users-exist') {
    return (
      <div className="p-4 bg-blue-50 rounded-md">
        <h1 className="text-xl font-bold">Admin User Setup</h1>
        <p>There are already {setupInfo.count} users in the system.</p>
        <p>Please use the sign-up form to create new users or the login form to sign in.</p>
      </div>
    );
  }

  // No users
  return (
    <div className="p-4 bg-green-50 rounded-md">
      <h1 className="text-xl font-bold">Admin User Setup</h1>
      <p>No users found. Create an admin account to get started.</p>
    </div>
  );
}
