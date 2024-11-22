// app/(main)/tests/login.test.js

const login = require('../_components/login');

describe('Login Functionality', () => {
  test('User successfully logs in with valid email and login code', () => {
    const email = 'testuser@example.com';
    const code = '123456';

    const result = login(email, code);
    expect(result).toBe(true); 
  });

  test('Throws error when email is not found', () => {
    const email = 'invaliduser@example.com';
    const code = '123456';

    expect(() => {
      login(email, code);
    }).toThrow('Email not found');
  });

  test('Throws error for invalid login code', () => {
    const email = 'testuser@example.com';
    const code = 'wrongcode';

    expect(() => {
      login(email, code);
    }).toThrow('Invalid login code');
  });
});
