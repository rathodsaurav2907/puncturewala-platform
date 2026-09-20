const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('../src/models/Booking');
const Technician = require('../src/models/Technician');
const Analytics = require('../src/models/Analytics');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');

    await Booking.deleteMany({});
    await Technician.deleteMany({});
    await Analytics.deleteMany({});

    const serviceAreas = ['Downtown', 'Midtown', 'Uptown', 'Suburbs', 'Airport Area'];
    const technicianNames = [
      'Rajesh Kumar', 'Priya Singh', 'Amit Patel', 'Neha Sharma', 'Vikram Desai',
      'Anjali Verma', 'Suresh Gupta', 'Maya Nair', 'Rohit Kumar', 'Pooja Rao',
      'Arjun Singh', 'Divya Reddy', 'Kamal Kapoor', 'Shruti Rao', 'Nitin Verma',
      'Sneha Gupta', 'Harish Kumar', 'Isha Patel', 'Ravi Singh', 'Ananya Sharma'
    ];

    const technicians = [];
    for (let i = 0; i < 20; i++) {
      const technician = new Technician({
        technicianId: `TECH-${1000 + i}`,
        name: technicianNames[i],
        phone: `+91-${9000000000 + i}`,
        email: `tech${i + 1}@puncturewala.com`,
        experience: Math.floor(Math.random() * 10) + 1,
        rating: (Math.random() * 1 + 4).toFixed(1),
        serviceArea: [serviceAreas[Math.floor(Math.random() * serviceAreas.length)]],
        status: ['active', 'inactive', 'on-break'][Math.floor(Math.random() * 3)],
        totalBookings: Math.floor(Math.random() * 200) + 10,
        completedBookings: Math.floor(Math.random() * 180) + 5,
        hourlyRate: Math.floor(Math.random() * 300) + 200,
        certifications: ['Basic Repair', 'Tire Replacement'],
        isVerified: Math.random() > 0.3
      });
      technicians.push(technician);
    }

    await Technician.insertMany(technicians);
    console.log('20 technicians seeded');

    const bookings = [];
    const statuses = ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'];
    const serviceTypes = ['puncture-repair', 'tire-replacement', 'wheel-alignment', 'emergency'];

    for (let i = 0; i < 50; i++) {
      const technician = technicians[Math.floor(Math.random() * technicians.length)];
      const bookingTime = new Date();
      bookingTime.setDate(bookingTime.getDate() - Math.floor(Math.random() * 30));

      const booking = new Booking({
        bookingId: `BK-${10000 + i}`,
        customerId: new mongoose.Types.ObjectId(),
        customerName: `Customer ${i + 1}`,
        customerPhone: `+91-${9100000000 + i}`,
        technicianId: technician._id,
        technicianName: technician.name,
        location: {
          latitude: 28.6139 + (Math.random() - 0.5) * 0.1,
          longitude: 77.2090 + (Math.random() - 0.5) * 0.1,
          address: `Location ${i + 1}, Delhi`
        },
        status: statuses[Math.floor(Math.random() * statuses.length)],
        bookingTime,
        completionTime: Math.random() > 0.3 ? new Date(bookingTime.getTime() + 30 * 60000) : null,
        serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
        amount: Math.floor(Math.random() * 1000) + 300,
        paymentStatus: Math.random() > 0.1 ? 'completed' : 'pending',
        rating: Math.random() > 0.2 ? Math.floor(Math.random() * 2) + 4 : null
      });
      bookings.push(booking);
    }

    await Booking.insertMany(bookings);
    console.log('50 bookings seeded');

    for (let day = 0; day < 30; day++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setHours(0, 0, 0, 0);

      const dayBookings = bookings.filter(b => {
        const bDate = new Date(b.bookingTime);
        bDate.setHours(0, 0, 0, 0);
        return bDate.getTime() === date.getTime();
      });

      const analytics = new Analytics({
        date,
        totalBookings: dayBookings.length,
        completedBookings: Math.floor(dayBookings.length * 0.8),
        cancelledBookings: Math.floor(dayBookings.length * 0.1),
        totalRevenue: dayBookings.reduce((sum, b) => sum + b.amount, 0),
        averageRating: 4.5,
        activeBookings: Math.floor(dayBookings.length * 0.3),
        averageCompletionTime: 45,
        totalTechnicians: 20,
        activeTechnicians: Math.floor(Math.random() * 15) + 5,
        newBookings: Math.floor(Math.random() * 10) + 2,
        peakHour: Math.floor(Math.random() * 23),
        serviceTypeDistribution: {
          punctureRepair: Math.floor(dayBookings.length * 0.4),
          tireReplacement: Math.floor(dayBookings.length * 0.3),
          wheelAlignment: Math.floor(dayBookings.length * 0.2),
          emergency: Math.floor(dayBookings.length * 0.1)
        },
        topTechnicians: technicians.slice(0, 5).map(t => ({
          technicianId: t.technicianId,
          name: t.name,
          bookingsCompleted: Math.floor(Math.random() * 20) + 5,
          revenue: Math.floor(Math.random() * 10000) + 2000
        })),
        paymentMetrics: {
          totalPayments: dayBookings.length,
          successfulPayments: Math.floor(dayBookings.length * 0.95),
          failedPayments: Math.floor(dayBookings.length * 0.05),
          paymentSuccessRate: 95
        }
      });

      await analytics.save();
    }

    console.log('Analytics for 30 days seeded');
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
