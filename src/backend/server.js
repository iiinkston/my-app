const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { db } = require("../firebase");
const { collection, getDocs, addDoc, doc, setDoc, getDoc, query, where } = require("firebase/firestore");

const app = express();
const PORT = 8080;

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.get("/api/getProfile", async (req, res) => {
  try {
    const userId = req.query.userId;
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(userDoc.data());
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
});

app.post("/api/profile", upload.single("profilePicture"), async (req, res) => {
  try {
    const { name, userId } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;
    await setDoc(doc(db, "users", userId), { name, profilePicture }, { merge: true });
    res.json({ message: "Profile updated successfully!", user: { id: userId, name, profilePicture } });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed", error: error.message });
  }
});

app.post("/signUp", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userRef = collection(db, "users");
    const userQuery = query(userRef, where("email", "==", email));
    const existingUser = await getDocs(userQuery);
    if (!existingUser.empty) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserRef = doc(collection(db, "users"));
    await setDoc(newUserRef, { name, email, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully!", user: { id: newUserRef.id, name, email } });
  } catch (error) {
    res.status(500).json({ message: "Sign-Up failed", error: error.message });
  }
});

app.post("/signIn", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userQuery = query(collection(db, "users"), where("email", "==", email));
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.empty) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const user = userSnapshot.docs[0].data();
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    res.json({ message: "Login successful!", user });
  } catch (error) {
    res.status(500).json({ message: "Sign-In failed", error: error.message });
  }
});

app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}/`));