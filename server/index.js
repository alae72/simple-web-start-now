
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Database connection status
let isDatabaseConnected = false;

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err);
    console.log('Running in fallback mode without database');
    isDatabaseConnected = false;
  } else {
    console.log('Connected to PostgreSQL database');
    isDatabaseConnected = true;
    release();
  }
});

// Initialize database tables
async function initializeDatabase() {
  if (!isDatabaseConnected) {
    console.log('Skipping database initialization - no connection');
    return;
  }
  
  try {
    // Create properties table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        city VARCHAR(255),
        bedrooms INTEGER,
        bathrooms INTEGER,
        image_url TEXT,
        amenities TEXT[],
        status VARCHAR(50) DEFAULT 'approved',
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id),
        guest_name VARCHAR(255) NOT NULL,
        guest_email VARCHAR(255) NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        guests INTEGER DEFAULT 1,
        total_price DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create users table with proper authentication fields
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(255),
        role VARCHAR(50) DEFAULT 'customer',
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    isDatabaseConnected = false;
  }
}

initializeDatabase();

// Fallback data when database is not available
const fallbackProperties = [
  {
    id: 1,
    title: "Villa Azure Vista",
    description: "Luxurious villa with stunning ocean views",
    price: 250,
    location: "Martil Beach",
    city: "Martil",
    bedrooms: 4,
    bathrooms: 3,
    image_url: "/placeholder.svg",
    amenities: ["WiFi", "Pool", "Kitchen", "Parking"],
    status: "approved",
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Coastal Retreat",
    description: "Modern apartment near the beach",
    price: 150,
    location: "Marina District",
    city: "Martil",
    bedrooms: 2,
    bathrooms: 2,
    image_url: "/placeholder.svg",
    amenities: ["WiFi", "Air Conditioning", "Kitchen"],
    status: "approved",
    featured: true,
    created_at: new Date().toISOString()
  }
];

const fallbackBookings = [];

// In-memory fallback users (only used when database is not connected)
const fallbackUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@martilhaven.com',
    password: 'admin123',
    name: 'Admin User',
    phone: '+212 5XX XX XX XX',
    role: 'admin',
    status: 'active',
    created_at: new Date().toISOString(),
    last_login: null
  }
];

// API Routes

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password });
    
    let user = null;
    
    if (isDatabaseConnected) {
      // Try to find user by username or email in database
      const result = await pool.query(
        'SELECT * FROM users WHERE (username = $1 OR email = $1) AND password = $2',
        [username, password]
      );
      
      if (result.rows.length > 0) {
        user = result.rows[0];
        // Update last login
        await pool.query(
          'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
          [user.id]
        );
      }
    } else {
      // Fallback to in-memory users
      user = fallbackUsers.find(u => 
        (u.username === username || u.email === username) && u.password === password
      );
    }
    
    if (user) {
      console.log('Login successful for user:', user.username);
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status
        }
      });
    } else {
      console.log('Login failed for username:', username);
      res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Properties routes
app.get('/api/properties', async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      return res.json(fallbackProperties);
    }
    const result = await pool.query('SELECT * FROM properties ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.json(fallbackProperties);
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isDatabaseConnected) {
      const property = fallbackProperties.find(p => p.id == id);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      return res.json(property);
    }
    
    const result = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    const property = fallbackProperties.find(p => p.id == req.params.id);
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      const newProperty = {
        id: fallbackProperties.length + 1,
        ...req.body,
        created_at: new Date().toISOString(),
        status: 'approved',
        featured: req.body.featured || false
      };
      fallbackProperties.push(newProperty);
      return res.status(201).json(newProperty);
    }
    
    const { title, description, price, location, city, bedrooms, bathrooms, image_url, amenities, featured, status } = req.body;
    
    const result = await pool.query(
      'INSERT INTO properties (title, description, price, location, city, bedrooms, bathrooms, image_url, amenities, featured, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [title, description, price, location, city, bedrooms, bathrooms, image_url, amenities, featured || false, status || 'approved']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bookings routes
app.get('/api/bookings', async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      return res.json(fallbackBookings);
    }
    
    const result = await pool.query(`
      SELECT b.*, p.title as property_title 
      FROM bookings b 
      JOIN properties p ON b.property_id = p.id 
      ORDER BY b.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.json(fallbackBookings);
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      const newBooking = {
        id: fallbackBookings.length + 1,
        ...req.body,
        created_at: new Date().toISOString(),
        status: 'pending'
      };
      fallbackBookings.push(newBooking);
      return res.status(201).json(newBooking);
    }
    
    const { property_id, guest_name, guest_email, check_in, check_out, guests, total_price } = req.body;
    
    const result = await pool.query(
      'INSERT INTO bookings (property_id, guest_name, guest_email, check_in, check_out, guests, total_price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [property_id, guest_name, guest_email, check_in, check_out, guests, total_price]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Users routes
app.get('/api/users', async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      return res.json(fallbackUsers.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        name: u.name,
        phone: u.phone,
        role: u.role,
        status: u.status,
        registeredDate: u.created_at.split('T')[0],
        lastLogin: u.last_login || '-'
      })));
    }
    
    const result = await pool.query('SELECT id, username, email, name, phone, role, status, created_at, last_login FROM users ORDER BY created_at DESC');
    const users = result.rows.map(user => ({
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      name: user.name,
      phone: user.phone || '',
      role: user.role,
      status: user.status,
      registeredDate: user.created_at.toISOString().split('T')[0],
      lastLogin: user.last_login ? user.last_login.toISOString().split('T')[0] : '-'
    }));
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.json(fallbackUsers);
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password, name, phone, role, status } = req.body;
    
    if (!isDatabaseConnected) {
      const newUser = {
        id: fallbackUsers.length + 1,
        username,
        email,
        password,
        name,
        phone: phone || '',
        role: role || 'customer',
        status: status || 'active',
        created_at: new Date().toISOString(),
        last_login: null
      };
      fallbackUsers.push(newUser);
      return res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
        status: newUser.status,
        registeredDate: newUser.created_at.split('T')[0],
        lastLogin: '-'
      });
    }
    
    const result = await pool.query(
      'INSERT INTO users (username, email, password, name, phone, role, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, email, name, phone, role, status, created_at, last_login',
      [username, email, password, name, phone || '', role || 'customer', status || 'active']
    );
    
    const user = result.rows[0];
    res.status(201).json({
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      status: user.status,
      registeredDate: user.created_at.toISOString().split('T')[0],
      lastLogin: '-'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, name, phone, role, status } = req.body;
    
    if (!isDatabaseConnected) {
      const userIndex = fallbackUsers.findIndex(u => u.id == id);
      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      fallbackUsers[userIndex] = {
        ...fallbackUsers[userIndex],
        username,
        email,
        name,
        phone: phone || '',
        role,
        status
      };
      
      return res.json({
        id: fallbackUsers[userIndex].id,
        username: fallbackUsers[userIndex].username,
        email: fallbackUsers[userIndex].email,
        name: fallbackUsers[userIndex].name,
        phone: fallbackUsers[userIndex].phone,
        role: fallbackUsers[userIndex].role,
        status: fallbackUsers[userIndex].status,
        registeredDate: fallbackUsers[userIndex].created_at.split('T')[0],
        lastLogin: fallbackUsers[userIndex].last_login || '-'
      });
    }
    
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2, name = $3, phone = $4, role = $5, status = $6 WHERE id = $7 RETURNING id, username, email, name, phone, role, status, created_at, last_login',
      [username, email, name, phone || '', role, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    res.json({
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      status: user.status,
      registeredDate: user.created_at.toISOString().split('T')[0],
      lastLogin: user.last_login ? user.last_login.toISOString().split('T')[0] : '-'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isDatabaseConnected) {
      const userIndex = fallbackUsers.findIndex(u => u.id == id);
      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      fallbackUsers.splice(userIndex, 1);
      return res.json({ message: 'User deleted successfully' });
    }
    
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
