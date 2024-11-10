const express = require('express');
const fs = require('fs');
const port = 3000;
const app = express();

const loggerRouter = require("./routes/logger.route");

app.use(express.json());
app.use("/logger", loggerRouter);

app.get("/",(req, res)=>{
    res.json("Hello from the server");
})

//^adding a new book
app.post("/add/books", (req,res)=>{
    fs.readFile("db.json","utf-8",(err,data)=>{
        if(err){
            res.json({message: "Error reading the database"});
            return;
        }
        const books = JSON.parse(data).books;
        const newBook = {id: Date.now(), ...req.body};
        books.push(newBook);

        fs.writeFile("db.json", JSON.stringify({books}),(err,data)=>{
            if(err){
                res.json({message: "Error reading the database"});
                return;
            }
            res.json(newBook);
        })
    })
})

//^reading all the data from db.json
app.get("/books", (req, res)=>{
    fs.readFile("db.json","utf-8",(err,data)=>{
        if(err){
            res.json({message: "Error reading the database"});
            return;
        }
        const books = JSON.parse(data).books;
        res.json(books);
    })
})

//^updating a book
app.patch("/books/:id", (req,res)=>{
    fs.readFile("db.json", "utf-8",(err,data)=>{
        if(err){
            res.json({message: "Error reading the database"});
            return;
        }
        const books = JSON.parse(data).books;
        const updatedBook = books.map((book)=>{
            if(book.id == Number(req.params.id)){
                return{
                    ...book,
                    ...req.body
                }
            }
            return book;
        })

        fs.writeFile("db.json", JSON.stringify({books: updatedBook}),(err,data)=>{
            if(err){
                res.json({message: "Error reading the database"});
                return;
            }
            res.json(updatedBook);
        })
    })
})


//^deleting a book
app.delete("/books/delete/:id", (req,res)=>{
    fs.readFile("db.json", "utf-8", (err,data)=>{
        if(err){
            res.json({message: "Error reading the database"});
            return;
        }
        const books = JSON.parse(data).books;
        const filteredBooks = books.filter((book)=>{
            return book.id != Number(req.params.id);
        })
        fs.writeFile("db.json", JSON.stringify({books: filteredBooks}),(err,data)=>{
            if(err){
                res.json({message: "Error reading the database"});
                return;
            }
            res.json(filteredBooks);
        })
    })
})

//^reading the single book
app.get("/books/single/:id", (req, res)=>{
    fs.readFile("db.json", "utf-8", (err,data)=>{
        if(err){
            res.json({message: "Error reading the database"});
            return;
        }
        const books = JSON.parse(data).books;
        const book = books.find((book)=>{
            return book.id == Number(req.params.id);
        })
        res.json(book);
    })
})

//& error handling
app.get("*",(req,res)=>{
    res.json({message: "404 Page not found"});
}) 

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})