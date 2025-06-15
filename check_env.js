// check_env.js
require('dotenv').config();

console.log('--- Environment Check ---');
console.log('Current Working Directory:', process.cwd()); // This will show where Node.js thinks it is
console.log('Loaded BASE_URL:', process.env.BASE_URL);
console.log('Loaded API_BASE_URL:', process.env.API_BASE_URL);
console.log('--- End Environment Check ---');