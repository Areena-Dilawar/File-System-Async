const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

app.post("/book", (req, res) => {
  const book = req.body;
  fs.writeFile("example.json", JSON.stringify(book), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error writing to file");
    } else {
      res.status(201).send("Book added successfully");
    }
  });
});

app.get("/books", (req, res) => {
  fs.readFile("example.json", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
    } else {
      res.status(200).json({ message: "Book read successfully", data: JSON.parse(data) });
    }
  });
});

// Update book
app.put("/book/:id", (req, res) => {
  const bookId = req.params.id;
  const updatedBook = req.body;

  fs.readFile("example.json", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
      return;
    }
    let books = JSON.parse(data);
    const bookIndex = books.findIndex(b => b.id === bookId);
    
    if (bookIndex === -1) {
      return res.status(404).send("Book not found");
    }

    books[bookIndex] = { ...books[bookIndex], ...updatedBook };
    fs.writeFile("example.json", JSON.stringify(books), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error writing file");
      } else {
        res.status(200).send("Book updated successfully");
      }
    });
  });
});
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});