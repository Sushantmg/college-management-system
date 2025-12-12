"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const prisma_config_1 = __importDefault(require("./prisma-config"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3005;
async function startServer() {
    try {
        await prisma_config_1.default.$connect();
        console.log("🟢 Prisma connected to MongoDB Atlas!");
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error("🔴 Failed to connect to the database:", err);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map