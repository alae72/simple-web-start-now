
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property } from '@/data/properties';

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
  const [propertiesList, setPropertiesList] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeProperties = async () => {
      try {
        // Try to get properties from localStorage first
        const storedProperties = localStorage.getItem('martilhaven_properties');
        if (storedProperties) {
          const parsedProperties = JSON.parse(storedProperties);
          setPropertiesList(parsedProperties);
        } else {
          // Initialize with empty array if no stored properties
          setPropertiesList([]);
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        setPropertiesList([]);
      } finally {
        setLoading(false);
      }
    };

    initializeProperties();
  }, []);

  const addProperty = (newProperty: Omit<Property, 'id'>) => {
    const property: Property = {
      ...newProperty,
      id: `PROP${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      status: newProperty.status || 'pending' as 'pending',
    };

    setPropertiesList(prevProperties => {
      const updatedProperties = [...prevProperties, property];
      // Save to localStorage
      localStorage.setItem('martilhaven_properties', JSON.stringify(updatedProperties));
      return updatedProperties;
    });
  };

  const updateProperty = (id: string, updatedFields: Partial<Property>) => {
    setPropertiesList(prevProperties => {
      const updatedProperties = prevProperties.map(property => 
        property.id === id ? { ...property, ...updatedFields } : property
      );
      // Save to localStorage
      localStorage.setItem('martilhaven_properties', JSON.stringify(updatedProperties));
      return updatedProperties;
    });
  };

  const deleteProperty = (id: string) => {
    setPropertiesList(prevProperties => {
      const updatedProperties = prevProperties.filter(property => property.id !== id);
      // Save to localStorage
      localStorage.setItem('martilhaven_properties', JSON.stringify(updatedProperties));
      return updatedProperties;
    });
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
