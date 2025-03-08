import React from "react";
import LikeButton from "./LikeButton";
import Comment from "./comment";

const Post = ({ post }) => {
    return (
        <div className="post">
            {post.imageUrl && <img src={post.imageUrl} alt="User upload" className="post-image" />}
            <p>{post.text}</p>
            <div className="post-actions">
                <LikeButton postId={post.id} likes={post.likes} />
                <Comment postId={post.id} comments={post.comments} />
            </div>
        </div>
    );
};

export default Post;
