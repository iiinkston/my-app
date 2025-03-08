// src/components/LikeButton.js
import React, { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

const LikeButton = ({ postId, likes }) => {
    const [liked, setLiked] = useState(false);

    const handleLike = async () => {
        if (!liked) {
            const postRef = doc(db, "posts", postId);
            await updateDoc(postRef, { likes: increment(1) });
            setLiked(true);
        }
    };

    return (
        <button onClick={handleLike}>
            <i className={liked ? "fa-solid fa-thumbs-up" : "fa-regular fa-thumbs-up"}></i> {likes}
        </button>
    );
};

export default LikeButton;
