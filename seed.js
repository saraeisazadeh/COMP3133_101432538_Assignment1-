const mongoose = require('mongoose');
const Employee = require('./models/Employee');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Sample employee data
const sampleEmployees = [
  {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    gender: 'Male',
    designation: 'Software Engineer',
    salary: 5000,
    date_of_joining: new Date('2023-01-01'),
    department: 'Engineering',
    employee_photo: 'john_doe.jpg',
  },
  {
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    gender: 'Female',
    designation: 'Senior Software Engineer',
    salary: 7000,
    date_of_joining: new Date('2022-05-15'),
    department: 'Engineering',
    employee_photo: 'jane_smith.jpg',
  },
];

// Insert sample data into the database
const seedDatabase = async () => {
  try {
    await Employee.deleteMany({}); // Clear existing data
    await Employee.insertMany(sampleEmployees); // Insert new data
    console.log('✅ Sample data added successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close(); // Close the connection
  }
};

seedDatabase();