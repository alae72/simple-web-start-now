import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building, Calendar, DollarSign, TrendingUp, Settings, Plus, Edit, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProperties } from '@/contexts/PropertiesContext';
import { useBookings } from '@/contexts/BookingsContext';

const AdminDashboard = () => {
  const { properties } = useProperties();
  const { bookings } = useBookings();

  // Calculate stats
  const totalProperties = properties.length;
  const pendingProperties = properties.filter(p => p.status === 'pending').length;
  const approvedProperties = properties.filter(p => p.status === 'approved').length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  const stats = [
    {
      title: 'Total Properties',
      value: totalProperties,
      icon: Building,
      description: `${pendingProperties} pending approval`,
      link: '/admin/properties'
    },
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: Calendar,
      description: `${pendingBookings} pending review`,
      link: '/admin/bookings'
    },
    {
      title: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: 'From confirmed bookings',
      link: '/admin/bookings'
    },
    {
      title: 'Users',
      value: '1,234',
      icon: Users,
      description: '12 new this week',
      link: '/admin/users'
    }
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Admin</h2>
          <p className="text-gray-600">Here's what's happening with your platform today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <IconComponent className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <p className="text-xs text-gray-500 mb-2">{stat.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={stat.link}>View details</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Property Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Property Management
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/properties">
                    <Eye className="mr-1 h-4 w-4" />
                    View All Properties
                  </Link>
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Manage property listings, approvals, and featured properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Total Properties</h4>
                <p className="text-2xl font-bold text-blue-700">{totalProperties}</p>
                <p className="text-sm text-blue-600">Active listings</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-1">Pending Review</h4>
                <p className="text-2xl font-bold text-yellow-700">{pendingProperties}</p>
                <p className="text-sm text-yellow-600">Awaiting approval</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">Approved</h4>
                <p className="text-2xl font-bold text-green-700">{approvedProperties}</p>
                <p className="text-sm text-green-600">Live on site</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/admin/properties">
                  <Building className="mr-1 h-4 w-4" />
                  Manage Properties
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/properties?tab=pending">
                  Review Pending ({pendingProperties})
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Properties */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Properties
                <Link to="/admin/properties" className="text-sm font-medium text-moroccan-blue hover:underline">
                  View all properties
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {properties.slice(0, 3).map(property => (
                  <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{property.title}</p>
                      <p className="text-sm text-gray-500">{property.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${property.price}/night</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        property.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Bookings
                <Link to="/admin/bookings" className="text-sm font-medium text-moroccan-blue hover:underline">
                  View all
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.slice(0, 3).map(booking => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{booking.guestName}</p>
                      <p className="text-sm text-gray-500">Check-in: {booking.checkIn}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${booking.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
