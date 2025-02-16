const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Employee = require('./models/Employee');
require('dotenv').config();

const resolvers = {
    Query: {
        login: async (_, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user) throw new Error('User not found');
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) throw new Error('Invalid credentials');
            return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        },
        getEmployees: async () => await Employee.find(),
        getEmployeeById: async (_, { id }) => await Employee.findById(id),
        searchEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
            const query = {};
            if (designation) query.designation = designation;
            if (department) query.department = department;
            return await Employee.find(query);
        }
    },
    Mutation: {
        signup: async (_, { username, email, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            return await User.create({ username, email, password: hashedPassword });
        },
        addEmployee: async (_, args) => {
            try {
                const newEmployee = new Employee(args);
                await newEmployee.save();
                return newEmployee;
            } catch (error) {
                console.error("Error adding employee:", error.message);
                throw new Error("Failed to add employee");
            }
        },
        updateEmployeeById: async (_, { id, ...updates }) => {
            return await Employee.findByIdAndUpdate(id, updates, { new: true });
        },
        deleteEmployeeById: async (_, { id }) => {
            const deletedEmployee = await Employee.findByIdAndDelete(id);
            if (!deletedEmployee) throw new Error("Employee not found");
            return deletedEmployee;
        }
    }
};

module.exports = resolvers;