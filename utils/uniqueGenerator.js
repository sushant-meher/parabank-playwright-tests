// utils/uniqueGenerator.js

function generateUniqueUsername() {
  const timestamp = Date.now();
  // THIS IS THE CRITICAL CHANGE: Use toString(36) for a much wider range of unique random strings
  //const randomString = Math.random().toString(36).substring(2, 15); 
  //return `test_${timestamp}_${randomString}`;
  return `${timestamp}_user`;
}

function generateUniqueEmail() {
  // It's a good practice for email to be unique too, 
  // so base it on the unique username if the application uses email for uniqueness
  const username = generateUniqueUsername(); 
  return `${username}@example.com`;
}

module.exports = {
  generateUniqueUsername,
  generateUniqueEmail
};