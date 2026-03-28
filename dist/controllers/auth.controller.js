import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";
// ১. ইউজার রেজিস্ট্রেশন
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // ইমেইল চেক করা
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists!" });
        }
        // পাসওয়ার্ড হ্যাশ করা (নিরাপত্তার জন্য)
        const hashedPassword = await bcrypt.hash(password, 10);
        // নতুন ইউজার তৈরি
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER", // ডিফল্ট রোল
            },
        });
        res.status(201).json({ success: true, message: "User registered successfully!" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: { id: user.id, name: user.name, role: user.role },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//# sourceMappingURL=auth.controller.js.map