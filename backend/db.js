const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

const db = mongoose.connection;

db.on('connected', () => {
  console.log('MongoDB Connected');
});

db.on('error', (err) => {
  console.error(`MongoDB Connection Error: ${err}`);
});

db.on('disconnected', () => {
  console.log('MongoDB Disconnected');
});

db.on('reconnected', () => {
  console.log('MongoDB Reconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB Connection Closed');
  process.exit(0);
});

module.exports = connectDB;
