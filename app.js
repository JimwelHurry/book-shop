const express = require('express');
const app = express();
const port = 3000;  // Server will run on port 3000

// Simple route to check if the server is working
app.get('/', (req, res) => {
  res.send('Welcome to the Bookshop!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



app.get('/books', (req, res) => {
  // Example list of books, you can fetch this from a database
  const books = [
    { id: 1, title: 'Book 1', author: 'Author 1' },
    { id: 2, title: 'Book 2', author: 'Author 2' },
    { id: 3, title: 'Book 3', author: 'Author 3' }
  ];
  res.json(books);
});


app.get('/book/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  // Example book based on ISBN
  const book = { "id": 1, "title": "Book 1", "author": "Author 1", "isbn": "123456" };

  res.json(book);
});


app.get('/books/author/:author', (req, res) => {
  const author = req.params.author;
  // Example list of books by the author
  const booksByAuthor = [
    { id: 1, title: 'Book 1', author: author },
    { id: 2, title: 'Book 2', author: author }
  ];
  res.json(booksByAuthor);
});


app.get('/books/title', (req, res) => {
  const titleQuery = req.query.title; // Get title from the query string

  // Example list of books
  const books = [
    { id: 1, title: 'Book 1', author: 'Author 1' },
    { id: 2, title: 'Book 2', author: 'Author 2' },
    { id: 3, title: 'Book 3', author: 'Author 3' }
  ];

  // Filter books based on the title query
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(titleQuery.toLowerCase()));

  // Return filtered books as a response
  if (filteredBooks.length > 0) {
    res.json(filteredBooks);
  } else {
    res.status(404).json({ message: 'No books found with that title.' });
  }
});

// Sample data for books and reviews
const books = [
  { id: 1, title: 'Book 1', author: 'Author 1', reviews: ['Great book!', 'Very informative.'] },
  { id: 2, title: 'Book 2', author: 'Author 2', reviews: ['Not my type of book.'] },
  { id: 3, title: 'Book 3', author: 'Author 3', reviews: [] }
];

// Endpoint to get book review by book ID
app.get('/book/review/:id', (req, res) => {
  const bookId = parseInt(req.params.id); // Get book ID from URL params
  const book = books.find(b => b.id === bookId); // Find the book by ID

  if (book) {
    res.json({ book: book.title, reviews: book.reviews });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});


const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// In-memory user storage (to be replaced with database in real app)
let users = [];

// Endpoint to register a new user
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation (you can add more robust checks here)
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide all fields: username, email, password.' });
  }

  // Check if user already exists (simple check)
  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists with this email.' });
  }

  // Register the new user
  const newUser = { username, email, password };
  users.push(newUser);

  // Respond with success message
  res.status(201).json({ message: 'User registered successfully', user: newUser });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


app.post('/addReview', async (req, res) => {
  const { bookId, userId, review } = req.body;

  // Check if the user has already reviewed this book
  const existingReview = await Review.findOne({ bookId: bookId, userId: userId });

  if (existingReview) {
    // Modify existing review
    existingReview.review = review;
    await existingReview.save();
    return res.status(200).json({ message: "Review updated successfully." });
  } else {
    // Add new review
    const newReview = new Review({
      bookId: bookId,
      userId: userId,
      review: review
    });
    await newReview.save();
    return res.status(201).json({ message: "Review added successfully." });
  }
});


app.delete('/deleteReview', async (req, res) => {
  const { bookId, userId } = req.body;

  // Check if the review exists
  const review = await Review.findOne({ bookId: bookId, userId: userId });

  if (!review) {
    return res.status(404).json({ message: "Review not found." });
  }

  // Delete the review
  await Review.deleteOne({ bookId: bookId, userId: userId });

  return res.status(200).json({ message: "Review deleted successfully." });
});

app.get('/searchByISBN', (req, res) => {
  const isbn = req.query.isbn; // Get ISBN from query params

  // Using Promise to fetch data
  Book.findOne({ isbn: isbn })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: "Book not found." });
      }
      return res.status(200).json(book);
    })
    .catch(err => {
      return res.status(500).json({ message: "Server error", error: err });
    });
});

app.get('/getAllBooks', async (req, res) => {
  try {
    // Call the asynchronous function to get all books
    const books = await getAllBooks();
    // Respond with the books in JSON format
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error });
  }
});


// Example function to fetch all books from the database
const getAllBooks = async () => {
  return new Promise((resolve, reject) => {
    // Use your model to get all books from the database
    Book.find({}, (err, books) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(books); // Resolve the promise with the books data
      }
    });
  });
};



// Route to search books by author
app.get('/searchByAuthor', async (req, res) => {
  try {
    const authorName = req.query.author; // Extract the author's name from query parameters

    if (!authorName) {
      return res.status(400).json({ message: 'Author name is required' });
    }

    // Call the async function to get books by author
    const booksByAuthor = await searchByAuthor(authorName);
    res.status(200).json(booksByAuthor); // Respond with the books in JSON format
  } catch (error) {
    res.status(500).json({ message: 'Error searching books by author', error: error });
  }
});
