const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;

  if(username && password){
    if(!isValid(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({
        message:"User registration done. Pls login"
      });
    }
    else{
      return res.status(404).json({message:"User already exists"})
    }
  }
  res.status(404).json({message:"Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify({books},null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  res.send(books[isbn])
});
  
// Get book details based on author


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title
  let no_of_books = Object.keys(books).length

  for(i=1;i<no_of_books;i++) {
        if(books[i].title === title) {
            res.send(books[i])
        }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  res.send(books[isbn].reviews)
});

const listAllBooks = async() => {
    const getBooks = await Promise.resolve(books)
    if (getBooks) {
        return getBooks
    }
    else {
        return Promise.reject(new Error('Books not found'))
    }   
}

public_users.get('/',async (req, res) => {
    //Write your code here
    let listOfBooks = await listAllBooks()
    res.send(listOfBooks)
});

const listBookDetailsForISBN = async(isbn) => {
    const getBook = await Promise.resolve(books[isbn])
    if (getBook) {
        return getBook
    }
    else {
        return Promise.reject(new Error('Book not found'))
    }   
}

public_users.get('/isbn/:isbn',async (req, res) => {
    //Write your code here
    let book = await listBookDetailsForISBN(req.params.isbn)
    res.send(book)
});

const listBookDetailsForAuthor = async(author) => {
    if (author) {
        const authBook = [];
        Object.values(books).map((book)=>{
        if (book.author === author) {
          authBook.push(book);
        }})
        return Promise.resolve(authBook);
      }
      else {
        return Promise.reject(new error("Book not found"));
      }
}

public_users.get('/author/:author',async (req, res) => {
    //Write your code here
    let book = await listBookDetailsForAuthor(req.params.author)
    res.send(book)
});

const listBookDetailsForTitle = async(title) => {
      if (title) {
        const titleBook=[];
        Object.values(books).map((book)=>{
        if (book.title===title) {
          titleBook.push(book);
        }})
        return Promise.resolve(titleBook);
      }
      else{
        return Promise.reject(new error("Book not found"));
      }
      
}
  
public_users.get('/title/:title',async(req,res) => {
    const book = await listBookDetailsForTitle(req.params.title);
    res.send(book);
})

module.exports.general = public_users;
