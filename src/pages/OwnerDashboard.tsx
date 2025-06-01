
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyForm from '@/components/PropertyForm';
import { useProperties } from '@/contexts/PropertiesContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Property } from '@/data/properties';
import { Pencil, Plus, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { properties, addProperty, updateProperty, deleteProperty } = useProperties();
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  
  // Mock user data - in a real app, this would come from authentication
  const mockUserId = "owner123";
  
  // Filter properties for the current user
  const ownerProperties = properties.filter(p => p.ownerId === mockUserId);
  
  const handleAddProperty = (propertyData: any) => {
    addProperty({
      ...propertyData,
      ownerId: mockUserId, // Add owner ID to the property
      status: 'pending', // New listings start as pending
      createdAt: new Date().toISOString(),
    });
    
    setIsAddingProperty(false);
    toast({
      title: "Property submitted",
      description: "Your property listing has been submitted for review.",
    });
  };
  
  const handleUpdateProperty = (propertyData: any) => {
    if (editingProperty) {
      updateProperty(editingProperty.id, {
        ...propertyData,
        updatedAt: new Date().toISOString(),
      });
      
      setEditingProperty(null);
      toast({
        title: "Property updated",
        description: "Your property listing has been updated.",
      });
    }
  };
  
  const handleDeleteProperty = (id: string) => {
    if (window.confirm("Are you sure you want to delete this property listing?")) {
      deleteProperty(id);
      toast({
        title: "Property deleted",
        description: "Your property listing has been deleted.",
      });
    }
  };
  
  // Render property form modal or property listings
  if (isAddingProperty || editingProperty) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-16">
          <div className="container-custom">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingProperty(false);
                  setEditingProperty(null);
                }}
              >
                Back to Dashboard
              </Button>
            </div>
            
            <PropertyForm
              property={editingProperty || undefined}
              onSubmit={editingProperty ? handleUpdateProperty : handleAddProperty}
              onCancel={() => {
                setIsAddingProperty(false);
                setEditingProperty(null);
              }}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-16">
        <div className="container-custom">
          <div className="mb-10">
            <h1 className="text-3xl font-serif font-medium mb-2">Property Owner Dashboard</h1>
            <p className="text-gray-600">Manage your property listings and bookings</p>
          </div>
          
          <Tabs defaultValue="properties" className="mb-10">
            <TabsList>
              <TabsTrigger value="properties">My Properties</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="pt-6">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-medium">My Properties</h2>
                <Button 
                  onClick={() => setIsAddingProperty(true)}
                  className="bg-moroccan-blue hover:bg-moroccan-blue/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Property
                </Button>
              </div>
              
              {ownerProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ownerProperties.map((property) => (
                    <Card key={property.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{property.title}</CardTitle>
                            <CardDescription>{property.location}</CardDescription>
                          </div>
                          <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                            property.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {property.status === 'approved' ? 'Approved' : 
                             property.status === 'pending' ? 'Pending Review' : 
                             'Rejected'}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm">
                          <span>${property.price}/{property.priceUnit}</span>
                          <span>{property.bedrooms} bedrooms</span>
                          <span>{property.bathrooms} bathrooms</span>
                        </div>
                        {property.images && property.images.length > 0 && (
                          <div className="mt-4 h-32 w-full overflow-hidden rounded-md">
                            <img 
                              src={property.images[0]} 
                              alt={property.title} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/property/${property.id}`)}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
                        <div className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingProperty(property)}
                          >
                            <Pencil className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gray-100 rounded-full">
                    <Plus className="h-8 w-8 text-moroccan-blue" />
                  </div>
                  <h2 className="text-2xl font-serif font-medium mb-3">No properties yet</h2>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    You haven't added any properties to your portfolio yet. 
                    Start by adding your first property.
                  </p>
                  <Button 
                    onClick={() => setIsAddingProperty(true)}
                    className="bg-moroccan-blue hover:bg-moroccan-blue/90"
                  >
                    Add Your First Property
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="bookings" className="pt-6">
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-serif font-medium mb-3">Bookings Coming Soon</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Booking management features will be available in the next update.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="profile" className="pt-6">
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-serif font-medium mb-3">Profile Settings Coming Soon</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Profile management features will be available in the next update.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OwnerDashboard;
