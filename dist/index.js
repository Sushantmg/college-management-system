"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_config_1 = __importDefault(require("./prisma-config"));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const course_1 = __importDefault(require("./routes/course"));
const department_1 = __importDefault(require("./routes/department"));
const student_1 = __importDefault(require("./routes/student"));
const teacher_1 = __importDefault(require("./routes/teacher"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3005;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
// API Test Route
app.get("/", (_req, res) => {
    res.send("🎓 College Management System API Running Successfully!");
});
// Register all routes
app.use("/auth", auth_1.default);
app.use("/courses", course_1.default);
app.use("/departments", department_1.default);
app.use("/students", student_1.default);
app.use("/teachers", teacher_1.default);
// 404 Handler
app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
});
// Global Error Handler
app.use((err, _req, res, _next) => {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
});
// Start server + check Prisma connection
async function startServer() {
    try {
        await prisma_config_1.default.$connect();
        console.log("🟢 Prisma connected to MongoDB Atlas!");
        app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
    }
    catch (err) {
        console.error("🔴 Failed to connect to the database:", err);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map