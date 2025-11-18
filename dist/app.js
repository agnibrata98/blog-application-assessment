"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const db_1 = require("./app/config/db");
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // your frontend's URL
    credentials: true // if you use cookies or auth headers
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your_session_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));
app.use((0, connect_flash_1.default)());
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express_1.default.static(__dirname + "/public"));
const auth_routes_1 = require("./app/routers/api/auth.routes");
app.use("/api/auth", auth_routes_1.apiAuthRouter);
const blog_routes_1 = require("./app/routers/api/blog.routes");
app.use("/api/blogs", blog_routes_1.blogRouter);
const auth_routes_2 = require("./app/routers/ejs/auth.routes");
app.use("/auth", auth_routes_2.ejsAuthRouter);
const admin_routes_1 = require("./app/routers/ejs/admin.routes");
app.use(admin_routes_1.ejsAdminRouter);
const ejsAdminBlog_routes_1 = require("./app/routers/ejs/ejsAdminBlog.routes");
app.use(ejsAdminBlog_routes_1.adminBlogRouter);
db_1.db.then(() => {
    app.listen(port, () => console.log(`Server is listening on port http://localhost:${port}`));
});
// admin credential 
// mail - admin@yopmail.com
// password = abcd1234
