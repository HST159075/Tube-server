import app from "./app.js";
import { prisma } from "./lib/prisma.js";
const PORT = process.env.PORT || 5000;
async function main() {
    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully!");
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server is Running on port ${PORT}..!`);
        });
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.log("Server closed");
                });
            }
            prisma.$disconnect();
            process.exit(1);
        };
        process.on("uncaughtException", exitHandler);
        process.on("unhandledRejection", exitHandler);
    }
    catch (error) {
        console.error("❌ Database connection failed:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}
main();
//# sourceMappingURL=server.js.map