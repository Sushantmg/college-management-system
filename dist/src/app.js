"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const course_1 = __importDefault(require("./routes/course"));
const department_1 = __importDefault(require("./routes/department"));
const student_1 = __importDefault(require("./routes/student"));
const teacher_1 = __importDefault(require("./routes/teacher"));
dotenv_1.default.config();
// Create app
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
// Test route
app.get("/", (_req, res) => {
    res.send("🎓 College Management System API Running Successfully!");
});
// Register routes
app.use("/auth", auth_1.default);
app.use("/courses", course_1.default);
app.use("/departments", department_1.default);
app.use("/students", student_1.default);
app.use("/teachers", teacher_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
});
// Global error handler
app.use((err, _req, res, _next) => {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
});
exports.default = app;
//# sourceMappingURL=app.js.map