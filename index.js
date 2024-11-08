const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

app.post("/create", (req, res) => {
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

app.get("/read", (req, res) => {
  fs.readFile("example.json", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
    } else {
      res.status(200).json({ message: "Book read successfully", data: JSON.parse(data) });
    }
  });
});

app.put("/update/:id", (req, res) => {
  const bookId = parseInt(req.params.id, 10);
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

app.delete("/delete/:id", (req, res) => {
    const bookId = parseInt(req.params.id, 10); 
  
    fs.readFile("example.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error reading file");
      }
  
      let books;
      if (data) {
        try {
          books = JSON.parse(data);
        } catch (parseErr) {
          console.error("Failed to parse data:", parseErr);
          return res.status(500).send("Data format error");
        }
      } else {
        return res.status(500).send("No data found in the file");
      }
      const bookIndex = books.findIndex((b) => b.id === bookId);
      if (bookIndex === -1) {
        return res.status(404).send("Book not found");
      }
      books.splice(bookIndex, 1);
  
      fs.writeFile("example.json", JSON.stringify(books, null, 2), (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return res.status(500).send("Error writing file");
        }
        res.status(200).send("Book deleted successfully");
      });
    });
  });

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});