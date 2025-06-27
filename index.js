import {Console, error} from "console";
import express from "express";
import fs from "fs";// Importar la libreria  que em permite trabajar con los archivos del sistema
import bodyParser from "body-parser";
import {json} from "stream/consumers";
//Levantar el servidor express
const  app = express();
app.use(bodyParser.json());
//leer la dacta del archivo 
const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
        return null;
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }    
};

readData();
app.get("/", (req, res) => {
    //Caliback  o funcion que recibe  dos parametros,peticion y respuesta
    res.send("Bienvenido a mi primera API con Nodejs");
});

app.get("/books", (req, res) => {
    const data = readData();
    res.json(data.books);
});

app.get("/books/:id", (req, res) => {

    const data = readData();

    const id  = parseInt(req.params.id);

    const  books = data.books.find((book) => book.id === id);

    res.json(books);
});



app.post("/books", (req, res) => {
    const data = readData();
    const body = req.body;
    const newBook = {
        id: data.books.length > 0 ? data.books[data.books.length - 1].id + 1 : 1,
        ...body,
    };
    data.books.push(newBook);
    writeData(data);
    res.status(201).json(newBook);
});

// Actualizar un libro existente
app.put("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found" });
    }
    // Actualiza solo los campos enviados en el body
    data.books[bookIndex] = { ...data.books[bookIndex], ...req.body };
    writeData(data);
    res.json(data.books[bookIndex]);
});

app.delete("/books/:id", (req, res) => {
    const data = readData();

    const id = parseInt(req.params.id);

    const bookIndex = data.books.findIndex((book) => book.id === id);

    data.books.splice(bookIndex, 1);

    writeData(data);

    res.json({ message: "Book deleted successfully" });

});

app.listen(3000, () => {
    console.log("El servidor está ecsuchando  en el puerto 3000");
});
