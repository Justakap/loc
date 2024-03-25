const express = require("express");
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const DriverModel = require('./models/driver')

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}));

const port = 8000;

mongoose.connect("mongodb+srv://anantk15:root@cluster0.972saxu.mongodb.net/transportation?retryWrites=true&w=majority").then(() => {
    console.log("MongoDB connection successful");
}).catch(error => {
    console.error("MongoDB connection error:", error);
});

app.get('/', (req, res) => {
    res.send("Hello");
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('message', (data) => {
        console.log(data);
        io.emit("message", data);
    });

    socket.on('locationUpdate', (data) => {
        // console.log(`Location update received from ${socket.id}:`, data);
        socket.broadcast.emit('locationUpdate', data);
    });
});

// add-driver route
app.post('/add-driver', async (req, res) => {
    const { name, password, org } = req.body;

    if (!name || !password || !org) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = {
        password: password,
        name: name,
        org: org
    };

    try {
        // console.log(data);
        await DriverModel.insertMany([data]); // Assuming DriverModel is a Mongoose model
        res.status(201).json({ message: 'Driver added successfully' });
    } catch (error) {
        console.error('Error adding driver:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

server.listen(port, () => {
    console.log(`Server started at port ${port}`);
});






// const express = require("express");
// const { createServer } = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const { default: DriverModel } = require("./models/driver");
// const bodyParser = require('body-parser');

// const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// const server = createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3001",
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });

// app.use(cors({
//     // origin: 'https://markeducation.netlify.app',
//     origin: ["http://localhost:3000"],
//     credentials: true,
// }));

// const port = 8000;

// mongoose.connect("mongodb+srv://anantk15:root@cluster0.972saxu.mongodb.net/transportation?retryWrites=true&w=majority").then(() => {
//     console.log("success mon")
// })



// app.get('/', (req, res) => {
//     res.send("Hello");
// });

// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     socket.on('message', (data) => {
//         console.log(data);
//         io.emit("message", data);
//     });

//     socket.on('locationUpdate', (data) => {
//         console.log(`Location update received from ${socket.id}:`, data);
//         socket.broadcast.emit('locationUpdate', data);
//     });
// });



// // add-driver

// app.post('/add-driver', async (req, res) => {
//     const { name, password, org } = req.body

//     const data = {
//         password: password,
//         name: name,
//         org: org
//     }

//     try {
//         console.log(data)
//         await DriverModel.insertMany([data])
//     } catch (error) {
//         console.log(error);
//         res.json("invalid")
//     }

// })




// server.listen(port, () => {
//     console.log(`Server started at port ${port}`);
// });
