import { db, storage, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const handlePost = async () => {
    if (newPost.trim() === "" && !image) return;

    setUploading(true);
    let imageUrl = "";
    try {
        // Get current user
        const user = auth.currentUser;
        if (!user) {
            alert("Please log in to post.");
            return;
        }

        // Fetch user's name from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const username = userDoc.exists() ? userDoc.data().name : "Unknown User";

        if (image) {
            const imageRef = ref(storage, `images/${uuidv4()}_${image.name}`);
            const uploadTask = uploadBytesResumable(imageRef, image);

            await new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    null,
                    (error) => reject(error),
                    async () => {
                        imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve();
                    }
                );
            });
        }

        // Save post to Firestore with username and user ID
        await addDoc(collection(db, "posts"), {
            text: newPost,
            imageUrl: imageUrl,
            likes: 0,
            comments: [],
            timestamp: serverTimestamp(),
            authorId: user.uid,
            authorName: username,
        });

        setNewPost("");
        setImage(null);
        setUploading(false);
        navigate("/communities");  // Redirect to refresh UI
    } catch (error) {
        console.error("Error uploading file: ", error);
        setUploading(false);
    }
};
