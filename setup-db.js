
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedDatabase() {
  try {
    // Insert sample properties
    const sampleProperties = [
      {
        title: 'Luxury Villa with Ocean View',
        description: 'Beautiful villa overlooking the Mediterranean Sea in Martil',
        price: 250.00,
        location: 'Martil, Morocco',
        bedrooms: 4,
        bathrooms: 3,
        image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
        amenities: ['WiFi', 'Pool', 'Beach Access', 'Air Conditioning']
      },
      {
        title: 'Cozy Apartment in City Center',
        description: 'Modern apartment in the heart of Martil with all amenities',
        price: 120.00,
        location: 'Martil Center, Morocco',
        bedrooms: 2,
        bathrooms: 2,
        image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        amenities: ['WiFi', 'Kitchen', 'Parking', 'Air Conditioning']
      }
    ];

    for (const property of sampleProperties) {
      await pool.query(
        'INSERT INTO properties (title, description, price, location, bedrooms, bathrooms, image_url, amenities) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [property.title, property.description, property.price, property.location, property.bedrooms, property.bathrooms, property.image_url, property.amenities]
      );
    }

    console.log('Sample data inserted successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

seedDatabase();
