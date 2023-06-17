const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const session = require('express-session');


// Connect to MongoDB
const connectionString = "mongodb+srv://shivam66jnp:XYPPYf4gyJf5El4O@cluster0.ru4bvi9.mongodb.net/Forum?retryWrites=true&w=majority";
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to the database');
}).catch((error) => {
  console.error('Failed to connect to the database:', error);
});

// Create Express app
const app = express();

// Set view engine and views directory

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Set static files directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(session({
  secret: '1234567', // Replace with your own secret key for session encryption
  resave: false,
  saveUninitialized: false,
  authenticated:false
}));


// Routes
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const loginRouter = require('./routes/login');

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/login', loginRouter); // Add this line to attach the login route

// Start the server
const port = process.env.PORT || 3000; // Use the environment variable for port or default to 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
