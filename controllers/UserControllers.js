import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        const { username, email, password,role } = req.body;
        console.log(username, email, password,role,"username, email, password,role")
        console.log("Incoming:", username, email, password);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role:role?role:'user' 
        });

        const savedUser = await newUser.save();

        res.status(200).json(savedUser);
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

      const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15d' } 
);
        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email,role:user.role } });
    } catch (err) {
        res.status(500).json(err);
    }
}
