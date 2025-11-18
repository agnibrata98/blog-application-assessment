import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { db } from "./app/config/db";
import cors from "cors";
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend's URL
    credentials: true // if you use cookies or auth headers
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
     } 
}));

app.use(flash());

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(__dirname + "/public"));



import { apiAuthRouter } from "./app/routers/api/auth.routes";
app.use("/api/auth", apiAuthRouter);

import { blogRouter } from "./app/routers/api/blog.routes";
app.use("/api/blogs", blogRouter);

import { ejsAuthRouter } from "./app/routers/ejs/auth.routes";
app.use("/auth", ejsAuthRouter);

import { ejsAdminRouter } from "./app/routers/ejs/admin.routes";
app.use(ejsAdminRouter);

import { adminBlogRouter } from './app/routers/ejs/ejsAdminBlog.routes';
app.use(adminBlogRouter);

db.then(() => {
  app.listen(port, () =>
    console.log(`Server is listening on port http://localhost:${port}`)
  );
});






// admin credential 
// mail - admin@yopmail.com
// password = abcd1234