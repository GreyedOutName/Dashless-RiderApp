// Protect your PayRex Secret API key at all costs. One common approach
// to store it in an environment variable.
// Add your PayRex test secret API key.
const payrexSecretApiKey = '';

const payrex = require('payrex-node')(payrexSecretApiKey);

// Create a PaymentIntent with amount and currency
const paymentIntent = await payrex.paymentIntents.create({
  // Amount is in cents. The sample below is 100.00.
  amount: 10000,
  currency: 'PHP',
  payment_methods: [
    'qrph',
    // add more payment methods if this is your preference
  ],
});

const output = {
  clientSecret: paymentIntent.clientSecret,
}

console.log(JSON.stringify(output));