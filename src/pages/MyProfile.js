import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db, storage, auth } from "../firebase"; 
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

import "../styles/MyProfile.css";

const MyProfile = () => {
  const navigate = useNavigate();
  const userCollection = "users";

  // 用户状态
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    profilePicture: "/userpic.jpeg", 
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(profile.profilePicture);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        console.log("Firebase authentication detected user:", authUser.uid);
        setUser(authUser);
        fetchProfile(authUser.uid);
      } else {
        console.warn("No user found, redirecting to sign-in.");
        navigate("/signIn", { replace: true });
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    if (!userId) return;

    try {
      const userDocRef = doc(db, userCollection, userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfile({
          id: userId,
          name: userData.name || "User",
          email: userData.email || "",
          profilePicture: userData.profilePicture || "/userpic.jpeg",
        });
        setPreview(userData.profilePicture || "/userpic.jpeg");
      } else {
       
        const newProfile = {
          name: user?.displayName || user?.email || "User",
          email: user?.email || "",
          profilePicture: "/userpic.jpeg",
        };

        await setDoc(userDocRef, newProfile);
        setProfile({ id: userId, ...newProfile });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      console.error("Error: User ID is missing. Cannot update Firestore document.");
      alert("Error: Cannot update profile because user ID is missing.");
      return;
    }

    try {
      let imageUrl = profile.profilePicture;

      if (selectedFile) {
        const imageRef = ref(storage, `profile_pictures/${user.uid}_${Date.now()}`);
        await uploadBytes(imageRef, selectedFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const userRef = doc(db, userCollection, user.uid);
      await setDoc(
        userRef,
        {
          name: profile.name,
          email: profile.email,
          profilePicture: imageUrl,
        },
        { merge: true }
      );

      setProfile({ ...profile, profilePicture: imageUrl });
      setPreview(imageUrl);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Check console.");
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading profile...</div>;
  }

  return (
    <Container className="profile-container">
      <Card className="profile-card">
        <h3 className="text-primary fw-bold text-center">My Profile</h3>

        {!isEditing ? (
          <div className="text-center">
            <img src={preview} alt="Profile" className="profile-img" />
            <h4 className="fw-bold">{profile.name}</h4>
            <Button variant="primary" className="profile-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
            <Button variant="outline-secondary" className="profile-btn mt-2" onClick={() => navigate("/others")}>
              Back to Others
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="profile-form-group text-center">
              <img src={preview} alt="Profile" className="profile-img" />
            </Form.Group>

            <Form.Group className="profile-form-group">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={profile.name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="profile-form-group">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
            </Form.Group>

            <Button type="submit" variant="success" className="profile-btn">
              Save Changes
            </Button>
            <Button variant="secondary" className="profile-btn" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </Form>
        )}
      </Card>
    </Container>
  );
};

export default MyProfile;
