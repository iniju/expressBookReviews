const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const allBooksPromise = () => Promise.resolve(books);
const booksByIsbnPromise = (isbn) => Promise.resolve(books[isbn]);
const booksByAuthorPromise = (author) => new Promise((resolve, reject) => {
    let filtered = {}
    for (var key in books) {
        if (books[key].author === author) filtered[key] = books[key];
    }
    resolve(filtered);
});
const booksByTitlePromise = (title) => new Promise((resolve, reject) => {
    let filtered = {}
    for (var key in books) {
        if (books[key].title === title) filtered[key] = books[key];
    }
    resolve(filtered);
});

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered." });
        } else {
            return res.status(404).json({ message: "User already exists." });
        }
    }
    return res.status(404).json({ message: "Username and password are required." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    allBooksPromise().then(result => res.send(JSON.stringify(result, null, 4)));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    booksByIsbnPromise(isbn).then(result => res.send(JSON.stringify(result, null, 4)));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let author = req.params.author;
    booksByAuthorPromise(author).then(result => res.send(JSON.stringify(result, null, 4)));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let title = req.params.title;
    booksByTitlePromise(title).then(result => res.send(JSON.stringify(result, null, 4)));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
