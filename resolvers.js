const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Employee = require('./models/Employee');

const resolvers = {
  Query: {
    login: async (_, { usernameOrEmail, password }) => {
      const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });
      if (!user) {
        throw new Error('User not found');
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Invalid password');
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, user };
    },

    getAllEmployees: async () => {
        try {
          console.log("Fetching all employees..."); // Debugging
          const employees = await Employee.find();
          console.log("Employees fetched:", employees); // Debugging
          return employees;
        } catch (error) {
          console.error("Error fetching employees:", error); // Debugging
          throw new Error('Failed to fetch employees');
        }
      },

    // Fetch employee by ID
    getEmployeeById: async (_, { eid }) => {
      try {
        const employee = await Employee.findById(eid);
        if (!employee) {
          throw new Error('Employee not found');
        }
        return employee;
      } catch (error) {
        throw new Error('Failed to fetch employee');
      }
    },

    // Search employees by designation or department
    searchEmployee: async (_, { designation, department }) => {
      try {
        const query = {};
        if (designation) query.designation = designation;
        if (department) query.department = department;

        const employees = await Employee.find(query);
        return employees;
      } catch (error) {
        throw new Error('Failed to search employees');
      }
    },
  },

  Mutation: {
    // Signup a new user
    signup: async (_, { username, email, password }) => {
        try {
          console.log("Signup Input:", { username, email, password }); // Log input
          const existingUser = await User.findOne({ $or: [{ username }, { email }] });
          if (existingUser) {
            throw new Error('Username or email already exists');
          }
          const user = new User({ username, email, password });
          await user.save();
          console.log("User saved successfully:", user); // Log saved user
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          return { token, user };
        } catch (error) {
          console.error("Signup Error Details:", error.message, error.stack); // Log detailed error
          throw new Error('Failed to sign up');
        }
      },
    // Add a new employee
    addEmployee: async (_, args) => {
        try {
          // Convert date_of_joining from string to Date
          const { date_of_joining, ...rest } = args;
          const employeeData = {
            ...rest,
            date_of_joining: new Date(date_of_joining),
          };
          const employee = new Employee(employeeData);
          await employee.save();
          return employee;
        } catch (error) {
          console.error("Error adding employee:", error);
          throw new Error('Failed to add employee');
        }
      },

    // Update an employee by ID
    updateEmployee: async (_, { eid, ...args }) => {
      try {
        const employee = await Employee.findByIdAndUpdate(
          eid,
          { ...args, updated_at: Date.now() },
          { new: true }
        );
        if (!employee) {
          throw new Error('Employee not found');
        }
        return employee;
      } catch (error) {
        throw new Error('Failed to update employee');
      }
    },

    // Delete an employee by ID
    deleteEmployee: async (_, { eid }) => {
      try {
        const employee = await Employee.findByIdAndDelete(eid);
        if (!employee) {
          throw new Error('Employee not found');
        }
        return `Employee with ID ${eid} deleted successfully`;
      } catch (error) {
        throw new Error('Failed to delete employee');
      }
    },
  },
};

module.exports = resolvers;