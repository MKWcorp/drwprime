'use client';

import { useUser } from '@clerk/nextjs';

interface StatCard {
  title: string;
  value: string;
  icon: string;
  change: string;
  changeType: 'positive' | 'negative';
}

export default function AdminDashboard() {
  const { user } = useUser();

  const stats: StatCard[] = [
    {
      title: "Total Members",
      value: "1,234",
      icon: "users",
      change: "+12% from last month",
      changeType: "positive"
    },
    {
      title: "Active Treatments",
      value: "89",
      icon: "activity",
      change: "+5% from last week",
      changeType: "positive"
    },
    {
      title: "Total Revenue",
      value: "Rp 456.7M",
      icon: "revenue",
      change: "+18% from last month",
      changeType: "positive"
    },
    {
      title: "Vouchers Redeemed",
      value: "342",
      icon: "voucher",
      change: "+8% from last month",
      changeType: "positive"
    }
  ];

  const recentActivities = [
    { user: "Sarah Johnson", action: "Redeemed Facial Basic voucher", time: "5 mins ago" },
    { user: "Michael Chen", action: "Registered for Gold Member Spa Day", time: "12 mins ago" },
    { user: "Amanda Lee", action: "Reached Platinum level", time: "1 hour ago" },
    { user: "David Wong", action: "Booked IPL Treatment", time: "2 hours ago" },
    { user: "Lisa Anderson", action: "Earned 500 loyalty points", time: "3 hours ago" }
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-2">
            Admin Dashboard
          </h1>
          <p className="text-white/70 text-lg">
            Welcome back, {user?.firstName || 'Admin'}
          </p>
          <p className="text-white/50 text-sm mt-1">
            User ID: {user?.id}
          </p>
        </div>

        {/* Stats Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  {stat.icon === 'users' && (
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                  {stat.icon === 'activity' && (
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                  {stat.icon === 'revenue' && (
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {stat.icon === 'voucher' && (
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  )}
                </div>
              </div>
              <h3 className="text-white/60 text-sm mb-2">{stat.title}</h3>
              <p className="font-playfair text-3xl font-bold text-primary mb-2">
                {stat.value}
              </p>
              <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-10">
          
          {/* Quick Actions - 5 columns */}
          <div className="lg:col-span-5 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6 hover:border-primary transition-all duration-500">
            <h2 className="font-playfair text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <button className="bg-gradient-to-r from-primary/30 to-primary/20 border border-primary/40 text-white px-5 py-4 rounded-lg hover:from-primary/40 hover:to-primary/30 transition-all duration-300 text-left group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Manage Members</p>
                    <p className="text-sm text-white/60">View and edit member profiles</p>
                  </div>
                  <svg className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              <button className="bg-gradient-to-r from-primary/30 to-primary/20 border border-primary/40 text-white px-5 py-4 rounded-lg hover:from-primary/40 hover:to-primary/30 transition-all duration-300 text-left group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Voucher Management</p>
                    <p className="text-sm text-white/60">Create and manage vouchers</p>
                  </div>
                  <svg className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              <button className="bg-gradient-to-r from-primary/30 to-primary/20 border border-primary/40 text-white px-5 py-4 rounded-lg hover:from-primary/40 hover:to-primary/30 transition-all duration-300 text-left group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Event Management</p>
                    <p className="text-sm text-white/60">Schedule and manage events</p>
                  </div>
                  <svg className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              <button className="bg-gradient-to-r from-primary/30 to-primary/20 border border-primary/40 text-white px-5 py-4 rounded-lg hover:from-primary/40 hover:to-primary/30 transition-all duration-300 text-left group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Analytics & Reports</p>
                    <p className="text-sm text-white/60">View detailed analytics</p>
                  </div>
                  <svg className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              <button className="bg-gradient-to-r from-primary/30 to-primary/20 border border-primary/40 text-white px-5 py-4 rounded-lg hover:from-primary/40 hover:to-primary/30 transition-all duration-300 text-left group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">System Settings</p>
                    <p className="text-sm text-white/60">Configure system preferences</p>
                  </div>
                  <svg className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activities - 7 columns */}
          <div className="lg:col-span-7 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6 hover:border-primary transition-all duration-500">
            <h2 className="font-playfair text-2xl font-bold text-white mb-6">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 bg-black/30 rounded-lg p-4 hover:bg-black/40 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{activity.user}</p>
                    <p className="text-white/60 text-sm">{activity.action}</p>
                    <p className="text-white/40 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6 hover:border-primary transition-all duration-500 group cursor-pointer">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-playfair text-xl font-bold text-white mb-2">Treatment Bookings</h3>
            <p className="text-white/60 text-sm mb-4">Manage treatment appointments and schedules</p>
            <p className="text-primary font-bold">156 active bookings</p>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6 hover:border-primary transition-all duration-500 group cursor-pointer">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="font-playfair text-xl font-bold text-white mb-2">Loyalty Program</h3>
            <p className="text-white/60 text-sm mb-4">Monitor member levels and rewards</p>
            <p className="text-primary font-bold">342 Gold members</p>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6 hover:border-primary transition-all duration-500 group cursor-pointer">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-playfair text-xl font-bold text-white mb-2">Content Management</h3>
            <p className="text-white/60 text-sm mb-4">Update treatments, gallery, and content</p>
            <p className="text-primary font-bold">Last updated 2h ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
