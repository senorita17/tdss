const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection (Local Database)
const MONGO_URI = "mongodb://localhost:27017/tds"; // Change 'qa_database' to your DB name

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Define Schema & Model
const qaSchema = new mongoose.Schema({
    question: String,
    answer: String
});
const QA = mongoose.model("QA", qaSchema,"quetsions");

// API Endpoint to Get Answer by Question
app.post("/api/get-answer", async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "❌ Question is required" });
    }

    try {
        const entry = await QA.findOne({ question: { $regex: new RegExp(`^${question}$`, "i") } });

        if (entry) {
            return res.json({ answer: entry.answer });
        } else {
            return res.json({ answer: "❌ Sorry, I don't know the answer to that question." });
        }
    } catch (err) {
        console.error("Error fetching answer:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// app.post("/api/get-answer", async (req, res) => {
//     const { question } = req.body;

//     if (!question) {
//         return res.status(400).json({ error: "❌ Question is required" });
//     }

//     try {
//         const entry = await QA.findOne({ $text: { $search: question } });

//         if (entry) {
//             return res.json({ answer: entry.answer });
//         } else {
//             return res.json({ answer: "❌ Sorry, I don't know the answer to that question." });
//         }
//     } catch (err) {
//         console.error("Error fetching answer:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
