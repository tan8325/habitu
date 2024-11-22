// app/(main)/_components/login.js

const database = {
  users: [
    { email: 'testuser@example.com', loginCode: '123456' },
    { email: 'user2@example.com', loginCode: '654321' },
  ],
};

// Function to verify email
const verifyEmail = (email) => {
  return database.users.some((user) => user.email === email);
};

// Function to verify login code
const verifyLoginCode = (email, code) => {
  const user = database.users.find((user) => user.email === email);
  return user && user.loginCode === code;
};

// Main login function
const login = (email, code) => {
  if (!verifyEmail(email)) {
    throw new Error('Email not found');
  }
  if (!verifyLoginCode(email, code)) {
    throw new Error('Invalid login code');
  }
  return true; // Simulates successful login
};

module.exports = login;
