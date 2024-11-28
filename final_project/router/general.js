// general.js is a module that exports a router object. The router object has a POST route that allows users to register. The router object also has GET routes that allow users to get the book list available in the shop, get book details based on ISBN, get book details based on author, get all books based on title, and get book review. The router object uses the books object from booksdb.js to populate the database with books when the server is started. The router object also uses the users object from auth_users.js to populate the users collection with users when the server is started. The router object is used to populate the books collection with books and the users collection with users. The router object is also used to handle requests from the client.

const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body; // Extract username and password from the request body

  // Step 1: Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Step 2: Check if the username already exists in the 'users' array
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists. Please choose a different username." });
  }

  // Step 3: Register the new user
  users.push({ username, password }); // Add the new user to the 'users' array

  // Step 4: Respond with success
  return res.status(201).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    // Simulating an asynchronous call to fetch the books
    const response = await new Promise((resolve) => {
      setTimeout(() => resolve(books), 1000); // Simulate a delay of 1 second
    });
    res.status(200).json(response); // Send the books as the response
  } catch (error) {
    res.status(500).json({ message: "Error fetching books." });
  }
});


// Get book details based on ISBN
// Task 11: Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params; // Extract ISBN from request parameters

  try {
    // Simulate fetching book details asynchronously
    const response = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]); // Resolve with book details
        } else {
          reject("Book not found with the given ISBN."); // Reject if ISBN is not found
        }
      }, 1000); // Simulate delay
    });

    res.status(200).json(response); // Send the book details as a response
  } catch (error) {
    res.status(404).json({ message: error }); // Send error if the book is not found
  }
});
  
// Get book details based on author
// Task 12: Get books by author using async/await
public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params; // Extract author from request parameters

  try {
    // Simulate fetching books asynchronously
    const response = await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Filter books by the given author
        const booksByAuthor = Object.values(books).filter(book => book.author === author);
        if (booksByAuthor.length > 0) {
          resolve(booksByAuthor); // Resolve with the list of books by the author
        } else {
          reject("No books found for the given author."); // Reject if no books are found
        }
      }, 1000); // Simulate delay
    });

    res.status(200).json(response); // Send the filtered books as a response
  } catch (error) {
    res.status(404).json({ message: error }); // Send error if no books are found
  }
});


// Get all books based on title
// Task 13: Get books by title using Promises
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params; // Extract title from request parameters

  // Simulate fetching books asynchronously
  new Promise((resolve, reject) => {
    setTimeout(() => {
      // Filter books by the given title
      const booksByTitle = Object.values(books).filter(book => book.title === title);
      if (booksByTitle.length > 0) {
        resolve(booksByTitle); // Resolve with the list of books with the given title
      } else {
        reject("No books found with the given title."); // Reject if no books are found
      }
    }, 1000); // Simulate delay
  })
    .then((response) => {
      res.status(200).json(response); // Send the filtered books as a response
    })
    .catch((error) => {
      res.status(404).json({ message: error }); // Send error if no books are found
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books[isbn]; // Access the book object using the ISBN as the key

  if (book) {
    return res.status(200).json(book.reviews); // Send the reviews as a JSON response
  } else {
    return res.status(404).json({ message: "Book not found with the given ISBN." }); // Handle the case where the book is not found
  }
});

module.exports.general = public_users;
