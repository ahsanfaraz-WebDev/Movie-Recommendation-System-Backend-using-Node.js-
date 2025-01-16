const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Adjusted path to db.js in config folder

// Importing routes
const userRoutes = require("./Routes/userRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const reviewRoutes = require("./Routes/reviewRoutes");
const recommendationRoutes = require("./Routes/recommendationRoute");
const customListRoutes = require("./Routes/customListRoutes");
const filterRoutes = require("./Routes/Filters");
const reminderRoutes = require("./Routes/reminderRoutes");
const forumRoutes = require("./Routes/forumRoute");
const notificationRoute = require("./Routes/notificationRoute");
const newsRoute = require("./Routes/NewsRoute");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize the Express app
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Define routes
app.get("/", (req, res) => {
  res.send("Welcome to the Movie Recommendation System");
});

app.use("/Users", userRoutes);
app.use("/Admin", adminRoutes);
app.use("/Review", reviewRoutes);
app.use("/Recommendation", recommendationRoutes);
app.use("/CustomList", customListRoutes);
app.use("/Movies", filterRoutes);
app.use("/Movies", reminderRoutes);
app.use("/Forum", forumRoutes);
app.use("/mail", notificationRoute);
app.use("/News", newsRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
