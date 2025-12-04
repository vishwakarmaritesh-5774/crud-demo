let express = require('express')
let app = express()
let User = require('./model')
let dbConnect = require('./dbConnect')
let cors = require('cors')
let jwt = require('jsonwebtoken');

// ➤ Mongoose Connect
dbConnect;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ➤ LOGIN USER
app.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;

        // 1. Check email exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "Email not found" });
        }

        // 2. Compare password
        let isMatch = user.password === password;
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Invalid password" });
        }

        // 3. Generate access token only
        let accessToken = jwt.sign(
            { userId: user._id },
            "ACCESS_SECRET",
            { expiresIn: "1h" }
        );

        res.json({
            success: true,
            message: "Login successful",
            accessToken,
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/* --------------------- CRUD APIs --------------------- */

// ➤ CREATE USER
app.post("/users", async (req, res) => {
    try {
        let user = new User(req.body);
        let savedUser = await user.save();
        res.status(201).json({ success: true, data: savedUser });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// ➤ GET ALL USERS
app.get("/users", async (req, res) => {
    try {
        let users = await User.find();
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ➤ GET SINGLE USER
app.get("/users/:id", async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, error: "User not found" });

        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ➤ UPDATE USER
app.put("/users/:id", async (req, res) => {
    try {
        let updated = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // return updated document
            runValidators: true,
        });

        if (!updated) return res.status(404).json({ success: false, error: "User not found" });

        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// ➤ DELETE USER
app.delete("/users/:id", async (req, res) => {
    try {
        let deleted = await User.findByIdAndDelete(req.params.id);

        if (!deleted) return res.status(404).json({ success: false, error: "User not found" });

        res.json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/* ----------------------------------------------------- */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));