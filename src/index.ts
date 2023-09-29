import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import router from './router';

dotenv.config();

const app = express();

app.use(cors({
    credentials: true
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => console.log("Server Running on  http://localhost:8080/"));

const MONGO_URL = process.env.DATABASE_URL;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error) => console.log(error));
mongoose.connection.once('open', () => console.log("Database Connected!"));

app.use('/', router());