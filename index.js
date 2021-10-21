import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { validationResult } from 'express-validator';
import { connect } from './libs/database.js';
import User from './models/user.js';
import File from './models/file.js';
import { messageRules } from './validation/messageRules.js';

// Setup NodeJS and connect to database
dotenv.config();
await connect();
// put 'uploads' into .gitignore !!
const upload = multer({ dest: 'uploads/' }) // where to save uploaded files to --> will create a uploads folder in your backend --> don't save your files into the database, they can't handle them well

// Setup app
const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log("[REQ] " + req.method + " " + req.path);
    next();
})

// middleware function checks if a valid JWT is included in the request
// throw in middlewares folder later
const checkLogin = (req, res, next) => {
    const rawJWTHeader = req.headers.authorization;
    if (!rawJWTHeader) { return res.sendStatus(401) };
    // const tokenToCheck = rawJWTHeader.split(" ")[1];
    const tokenToCheck = rawJWTHeader.slice(7); // alternative to .split()[index]
    jwt.verify(tokenToCheck, process.env.SECRET, function(err, decoded) {
        if (err) {
            console.log("Error verifying JWT: ", err.message);
            return res.sendStatus(401);
        }
        // console.log(decoded);
        next();
    });
}

// File upload
const uploadCheck = upload.fields([{ name: "selectedFile", maxCount: 1 }]);
app.post('/file', checkLogin, uploadCheck, async (req, res) => {
    // TODO: Add mongo schema for files -- DONE 
    
    try {
        // TODO: Save file data to database -- DONE
        // you only save data about the file not the file itself (the file will be put into the uploads folder in the backend)
        await File.create(req.files.selectedFile[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error);
        return;
    }
    
    // TODO: Check login? --> put the checkLogin function as middleware into the endpoint to make it secure
    res.json({ success: true }); // put a breakpoint here and use debugger to look at the req coming in if you upload a file in the frontend --> req.files[index] --> multer gives it a new hexadecimal filename
})

// Register new user
app.post('/register', async (req, res) => {
    const user = await User.register(req.body);
    if (!user) {
        return res.status(400).json({ success: false });
    }
    res.status(201);
    res.json({ success: true }); 
});

// login using email and password
app.post('/login', async (req, res) => {
    const user = await User.login(req.body); // all the logic is hidden away in user model
    if (!user) {
        return res.status(400).json({ user });
    }
    // Create JWT token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    res.json({ user, token });
});

// this middleware returns and array of middleware functions
// throw into checkValidation.js in middlewares folder later
const validate = (rules) => {
    const middlewares = rules;
    middlewares.push((req, res, next) => {
        // const result = validationResult(req);
        // if (!result.errors.isEmpty() {
        //     res.status(400);
        // } // older method used in earlier projects (not complete)
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            next();
        }
        res.status(400).json({
            errors: errors.array()
        })
    });
    return middlewares;
}

// secured endpoint (only logged in users can send messages)
const messages = ["First!"];
app.post('/message', checkLogin, validate(messageRules), (req, res) => {
    messages.push(req.body.message);
    res.send(messages); 
})

// backup, if all other middleware don't handle the request, this will
app.use((req,res) => {
    res.status(404);
    res.json({ error: "Resource not found" })
})

const port = process.env.PORT;
app.listen(port, () => console.log("Listening on http://localhost:"+port));