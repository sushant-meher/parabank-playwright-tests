// utils/uniqueGenerator.js

function generateUniqueUsername() {
  const timestamp = Date.now();
  return `${timestamp}_user`;
}

function generateUniqueEmail() {
  const username = generateUniqueUsername(); 
  return `${username}@example.com`;
}

module.exports = {
  generateUniqueUsername,
  generateUniqueEmail
};