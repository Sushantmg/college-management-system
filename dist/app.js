"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const department_routes_1 = __importDefault(require("./routes/department.routes"));
const student_routes_1 = __importDefault(require("./routes/student.routes"));
const teacher_routes_1 = __importDefault(require("./routes/teacher.routes"));
dotenv_1.default.config();
// Create app
const app = (0, express_1.default)();
// ------------------------------------
// MIDDLEWARE
// ------------------------------------
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
// ------------------------------------
// TEST ROUTE
// ------------------------------------
app.get("/", (_req, res) => {
    res.send("🎓 College Management System API Running Successfully!");
});
// ------------------------------------
// API ROUTES
// ------------------------------------
app.use("/auth", auth_routes_1.default);
app.use("/courses", course_routes_1.default);
app.use("/departments", department_routes_1.default);
app.use("/students", student_routes_1.default);
app.use("/teachers", teacher_routes_1.default);
// ------------------------------------
// 404 HANDLER
// ------------------------------------
app.use((_req, res) => {
    res.status(404).json({
        error: "Route not found",
    });
});
// ------------------------------------
// GLOBAL ERROR HANDLER
// ------------------------------------
app.use((err, _req, res, _next) => {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
        error: "Internal Server Error",
    });
});
exports.default = app;
