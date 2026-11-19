const mongoose = require('mongoose')
const dns = require('dns')

// Force IPv4 DNS resolution — fixes querySrv ECONNREFUSED on some Windows/Node setups
dns.setDefaultResultOrder('ipv4first')

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4, // force IPv4
    })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB

