import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, updateDoc, doc, increment, deleteDoc, onSnapshot } from "firebase/firestore";

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    // Fetch logged-in user
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            const querySnapshot = await getDocs(collection(db, "posts"));
            const postsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            postsArray.sort((a, b) => b.likes - a.likes);
            setPosts(postsArray);
        };
        fetchPosts();
    }, []);

    const handleLike = async (id) => {
        const postRef = doc(db, "posts", id);
        await updateDoc(postRef, { likes: increment(1) });
        window.location.reload();
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            await deleteDoc(doc(db, "posts", id));
            setPosts(posts.filter(post => post.id !== id));
        }
    };

    return (
        <div className="post-list">
            {posts.map((post) => (
                <div key={post.id} className="post">
                    <p><strong>{post.authorName}</strong></p> {/* Display the author's name */}
                    <p>{post.text}</p>

                    <div className="post-actions">
                        <button onClick={() => handleLike(post.id)}>
                            <i className="fa-regular fa-thumbs-up"></i> {post.likes}
                        </button>

                        {/* Show delete button only if logged-in user is the author */}
                        {currentUser && currentUser.uid === post.authorId && (
                            <button onClick={() => handleDelete(post.id)} className="delete-btn">
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostList;
