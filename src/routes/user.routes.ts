import { Router } from "express";
import prisma from "../db";
import { unlink } from "node:fs";

const router = Router();


// CREATE USER
router.post("/", async (req, res) => {
    try {
        const { name, email, age } = req.body;

        console.log("Creating user with data:", { name, email, age});

        const user = await prisma.user.create({
            data: {
                name,
                email,
                age: Number(age)
            }
        });

        res.json(user);
    } catch (error) {
        console.error("Prisma Create Error:", error);
        res.status(500).json({
            message: "User Create Failed",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});


// GET ALL USERS
router.get("/", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error("Prisma Fetch Error:", error);
        res.status(500).json({
            message: "Users Fetch Failed",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});


// GET SINGLE USER
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // If your schema uses Int for ID, use Number(id)
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });

        res.json(user);
    } catch (error) {
        console.error("Prisma Fetch Unique Error:", error);
        res.status(500).json({
            message: "Single User Fetch Failed",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});


// UPDATE USER
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, age } = req.body;

        const updatedUser = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                name,
                email,
                age: age ? Number(age) : 0
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error("Prisma Update Error:", error);
        res.status(500).json({
            message: "User Update Failed",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});


// DELETE USER
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await prisma.user.delete({
            where: {
                id: Number(id)
            }
        });

        res.json(deletedUser);
    } catch (error) {
        console.error("Prisma Delete Error:", error);
        res.status(500).json({
            message: "User Delete Failed",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});


export default router;