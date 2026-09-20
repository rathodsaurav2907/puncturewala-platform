const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const Booking = require('../src/models/Booking');
const Technician = require('../src/models/Technician');
const Analytics = require('../src/models/Analytics');

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/puncturewala-test');
  }
});

afterAll(async () => {
  await Booking.deleteMany({});
  await Technician.deleteMany({});
  await Analytics.deleteMany({});
  await mongoose.connection.close();
});

describe('Health Check', () => {
  test('GET /health should return 200 and healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.uptime).toBeGreaterThan(0);
  });
});

describe('Technician Endpoints', () => {
  let technicianId;

  test('POST /api/technicians - Create technician', async () => {
    const res = await request(app)
      .post('/api/technicians')
      .send({
        name: 'John Doe',
        phone: '+91-9999999999',
        email: 'john@test.com',
        experience: 5,
        serviceArea: ['Downtown'],
        hourlyRate: 300,
        certifications: ['Basic Repair']
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('John Doe');
    technicianId = res.body._id;
  });

  test('GET /api/technicians - List technicians', async () => {
    const res = await request(app).get('/api/technicians');
    expect(res.statusCode).toBe(200);
    expect(res.body.technicians).toBeInstanceOf(Array);
    expect(res.body.pagination).toBeDefined();
  });

  test('GET /api/technicians/:id - Get technician by ID', async () => {
    const res = await request(app).get(`/api/technicians/${technicianId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(technicianId);
  });

  test('PUT /api/technicians/:id - Update technician', async () => {
    const res = await request(app)
      .put(`/api/technicians/${technicianId}`)
      .send({
        rating: 4.8,
        totalBookings: 50
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.rating).toBe(4.8);
  });

  test('DELETE /api/technicians/:id - Delete technician', async () => {
    const res = await request(app).delete(`/api/technicians/${technicianId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});

describe('Booking Endpoints', () => {
  let bookingId, createdTechnicianId;

  beforeEach(async () => {
    const tech = new Technician({
      technicianId: `TECH-${Date.now()}`,
      name: 'Test Tech',
      phone: '+91-8888888888',
      email: 'testtech@test.com',
      experience: 3,
      hourlyRate: 250
    });
    await tech.save();
    createdTechnicianId = tech._id;
  });

  test('POST /api/bookings - Create booking', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({
        customerId: 'CUST-001',
        customerName: 'Jane Doe',
        customerPhone: '+91-7777777777',
        technicianId: createdTechnicianId,
        location: {
          latitude: 28.6139,
          longitude: 77.2090,
          address: 'Test Location, Delhi'
        },
        bookingTime: new Date(),
        serviceType: 'puncture-repair',
        amount: 500
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('pending');
    bookingId = res.body._id;
  });

  test('GET /api/bookings - List bookings', async () => {
    const res = await request(app).get('/api/bookings');
    expect(res.statusCode).toBe(200);
    expect(res.body.bookings).toBeInstanceOf(Array);
  });

  test('GET /api/bookings/:id - Get booking by ID', async () => {
    const res = await request(app).get(`/api/bookings/${bookingId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(bookingId);
  });

  test('PATCH /api/bookings/:id - Update booking status', async () => {
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}`)
      .send({
        status: 'completed',
        rating: 5
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('completed');
    expect(res.body.rating).toBe(5);
  });

  test('DELETE /api/bookings/:id - Delete booking', async () => {
    const res = await request(app).delete(`/api/bookings/${bookingId}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('Analytics Endpoints', () => {
  beforeEach(async () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const analytics = new Analytics({
      date,
      totalBookings: 25,
      completedBookings: 20,
      totalRevenue: 12500,
      averageRating: 4.5,
      activeTechnicians: 10
    });
    await analytics.save();
  });

  test('GET /api/analytics - Get last 30 days analytics', async () => {
    const res = await request(app).get('/api/analytics');
    expect(res.statusCode).toBe(200);
    expect(res.body.totalBookings).toBeGreaterThanOrEqual(0);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  test('GET /api/analytics?days=7 - Get last 7 days analytics', async () => {
    const res = await request(app).get('/api/analytics?days=7');
    expect(res.statusCode).toBe(200);
    expect(res.body.period).toBe('Last 7 days');
  });
});
