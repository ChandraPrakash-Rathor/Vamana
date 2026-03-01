const authController = require('./Member/controllers/authController');

console.log('Auth Controller:', authController);
console.log('Keys:', Object.keys(authController));
console.log('register:', typeof authController.register);
console.log('login:', typeof authController.login);
