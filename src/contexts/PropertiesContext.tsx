import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property } from '@/data/properties';
import { propertiesApi } from "@/lib/api";

interface PropertiesContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id'>) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  loading: boolean;
}

// Export the context so it can be imported directly
export const PropertiesContext = createContext<PropertiesContextType>({
  properties: [],
  addProperty: () => {},
  updateProperty: () => {},
  deleteProperty: () => {},
  loading: false
});

export const useProperties = () => {
  const context = useContext(PropertiesContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertiesProvider');
  }
  return context;
};

export const PropertiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [propertiesList, setPropertiesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await propertiesApi.getAll();
        setPropertiesList(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const addProperty = (newProperty: Omit<Property, 'id'>) => {
    const property: Property = {
      ...newProperty,
      id: `PROP${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      status: newProperty.status || 'pending' as 'pending', // Default status for new properties
    };

    setPropertiesList(prevProperties => [...prevProperties, property]);
  };

  const updateProperty = (id: string, updatedFields: Partial<Property>) => {
    setPropertiesList(prevProperties => 
      prevProperties.map(property => 
        property.id === id ? { ...property, ...updatedFields } : property
      )
    );
  };

  const deleteProperty = (id: string) => {
    setPropertiesList(prevProperties => 
      prevProperties.filter(property => property.id !== id)
    );
  };

  const value = {
    properties: propertiesList,
    loading,
    addProperty,
    updateProperty,
    deleteProperty,
  };

  return (
    <PropertiesContext.Provider value={value}>
      {children}
    </PropertiesContext.Provider>
  );
};