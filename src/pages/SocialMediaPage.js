import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, ListGroup, Image } from "react-bootstrap";
import { FaThumbsUp, FaPlus, FaTrash } from "react-icons/fa";
import { db, auth, storage } from "../firebase"; // Import storage
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, updateDoc, doc, arrayUnion, deleteDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import storage functions
import "../styles/Communities.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const SocialMediaPage = () => {
  const [showPostSection, setShowPostSection] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch posts from Firestore
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setCurrentUser(auth.currentUser);
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim() && !postImage) return;

    let imageUrl = "";

    if (postImage) {
      const storageRef = ref(storage, `posts/${Date.now()}_${postImage.name}`);
      const uploadTask = uploadBytesResumable(storageRef, postImage);

      try {
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => reject(error),
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    try {
      await addDoc(collection(db, "posts"), {
        content: postContent,
        imageUrl: imageUrl,
        likes: 0,
        comments: [],
        timestamp: serverTimestamp(),
        userId: currentUser?.uid || "guest",
        userName: currentUser?.displayName || "Anonymous",
      });

      setPostContent("");
      setPostImage(null);
      setShowPostSection(false);
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  const handleLike = async (postId, currentLikes) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { likes: currentLikes + 1 });
  };

  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleAddComment = async (postId) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    if (!currentUser) {
      alert("You must be signed in to comment.");
      return;
    }

    const postRef = doc(db, "posts", postId);
    try {
      await updateDoc(postRef, {
        comments: arrayUnion({
          text: commentText,
          userName: currentUser.displayName || "Anonymous",
          timestamp: new Date().toISOString(),
        }),
      });
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Container className="communities-container">
      <div className="d-flex justify-content-center align-items-center position-relative mb-3">
        <h3 className="text-primary fw-bold">Communities</h3>
        <Button variant="primary" className="post-toggle-btn" onClick={() => setShowPostSection(!showPostSection)}>
          <FaPlus />
        </Button>
      </div>

      {showPostSection && (
        <Card className="p-3 mb-4 shadow-sm">
          <Form onSubmit={handlePostSubmit}>
            <Form.Group className="mb-2">
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Share something with the community..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control type="file" accept="image/*" onChange={(e) => setPostImage(e.target.files[0])} />
            </Form.Group>
            <Button type="submit" variant="secondary" className="w-100">Post</Button>
          </Form>
        </Card>
      )}

      {posts.map((post) => (
        <Card key={post.id} className="mb-3 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">{post.userName || "Unknown User"}</span>
              {currentUser && currentUser.uid === post.userId && (
                <Button variant="danger" size="sm" onClick={() => handleDelete(post.id)}>
                  <FaTrash />
                </Button>
              )}
            </div>

            {post.imageUrl && <Image src={post.imageUrl} alt="Post" className="post-image mb-2" />}
            <Card.Text>{post.content}</Card.Text>
            <div className="d-flex justify-content-between align-items-center">
              <Button variant="outline-primary" size="sm" onClick={() => handleLike(post.id, post.likes)}>
                <FaThumbsUp /> {post.likes}
              </Button>
            </div>

            <div className="d-flex mt-2">
              <Form.Control
                type="text"
                placeholder="Add a comment..."
                value={commentInputs[post.id] || ""}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
              />
              <Button variant="primary" className="ms-2" onClick={() => handleAddComment(post.id)}>
                <i className="fa-solid fa-comment-dots"></i>
              </Button>
            </div>

            <ListGroup variant="flush" className="mt-2">
              {post.comments?.map((comment, index) => (
                <ListGroup.Item key={index} className="comment-item">
                  <strong>{comment.userName}</strong>: {comment.text} <br />
                  <small>{new Date(comment.timestamp).toLocaleString()}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default SocialMediaPage;
