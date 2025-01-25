import express from 'express';
import http from 'http';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

const app=express();

app.use(cors({
    credentials:true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyparser.json());

const server=http.createServer(app);

server.listen(8081,()=>{
    console.log('Server is running on http://localhost:8081/');
});

const MONGO_URL="mongodb+srv://swathysukumaran:g4pGjXwj22IlponE@cluster0.95gfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.Promise=Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error',(error:Error)=>{console.log(error);});
