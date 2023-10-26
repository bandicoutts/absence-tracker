require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const holidayRoutes = require('./routes/holidayRoutes');
const passportSetup = require('./config/passport'); // Assuming you have a passport configuration file

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Update with your client's URL
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
passportSetup(passport); // Initialize passport configuration

// Routes
app.use('/api/users', userRoutes);
app.use('/api/holidays', holidayRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
