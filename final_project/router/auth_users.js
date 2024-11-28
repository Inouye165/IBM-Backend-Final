// auth_users.js is a module that exports a router object. The router object has a POST route that allows registered users to login. The router object also has a PUT route that allows registered users to add a book review. The router object uses the books object from booksdb.js to populate the database with books when the server is started. The router object also uses the users object to populate the users collection with users when the server is started. The router object is used to populate the books collection with books and the users collection with users. The router object is also used to handle requests from the client.

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const SECRET_KEY = "your_secret_key"; // Replace with a strong, unique key

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login TASK 7
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body; // Extract username and password from the request body

  // Step 1: Validate username and password presence
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Step 2: Check if the user exists
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found. Please register first." });
  }

  // Step 3: Validate the password
  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid password. Please try again." });
  }

  // Step 4: Generate a JWT token for the session
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  // Step 5: Respond with the token
  return res.status(200).json({
    message: "Login successful!",
    token
  });
});

// Add a book review
regd_users.put("/review/:isbn", (req, res) => {
  const { isbn } = req.params; // Extract ISBN from the route parameters
  const { review } = req.query; // Extract review from the query parameters
  const authHeader = req.headers.authorization; // Extract the Authorization header

  // Step 1: Validate if the ISBN and review are provided
  if (!isbn || !review) {
    console.log("Missing Authorization header");
    return res.status(400).json({ message: "ISBN and review are required." });
  }

  // Step 2: Decode the JWT to get the username
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token
  let username;

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify the token
    username = decoded.username; // Get the username from the decoded token
    console.log("Decoded username:", username);
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }

  // Step 3: Check if the book exists
  const book = books[isbn];
  if (!book) {
    console.log("Book not found for ISBN:", isbn);
    return res.status(404).json({ message: "Book not found with the provided ISBN." });
  }

  // Step 4: Add or modify the review
  if (!book.reviews) {
    book.reviews = {}; // Initialize reviews if not present
  }

  book.reviews[username] = review; // Add or modify the user's review
  console.log("Updated reviews:", book.reviews);

  // Step 5: Respond with success
  return res.status(200).json({
    message: "Review added/modified successfully.",
    reviews: book.reviews
  });
});

regd_users.delete("/review/:isbn", (req, res) => {
  const { isbn } = req.params; // Extract ISBN from the route parameters
  const authHeader = req.headers.authorization; // Extract the Authorization header

  // Step 1: Validate the input
  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required." });
  }

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing." });
  }

  const token = authHeader.split(" ")[1];
  let username;

  try {
    // Step 2: Decode the JWT to get the username
    const decoded = jwt.verify(token, SECRET_KEY);
    username = decoded.username;
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }

  // Step 3: Check if the book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found with the provided ISBN." });
  }

  // Step 4: Check if the user's review exists
  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "No review found for this user." });
  }

  // Step 5: Delete the user's review
  delete book.reviews[username];

  // Step 6: Respond with success
  return res.status(200).json({
    message: "Review deleted successfully.",
    reviews: book.reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
