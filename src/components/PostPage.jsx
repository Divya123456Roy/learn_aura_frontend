// src/pages/PostPage.jsx
import "react-toastify/dist/ReactToastify.css";
import { createPostAPI, fetchPostsByForumAPI } from "../services/postAPI";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";


const PostPage = () => {
  const { forumId } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchPostsByForumAPI(forumId);
        setPosts(data.reverse());
      } catch (error) {
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [forumId]);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const data = await createPostAPI({ content: newPost, forumId });
      setPosts((prev) => [data, ...prev]);
      setNewPost("");
      toast.success("Post created!");
    } catch (error) {
      toast.error(error.message || "Failed to create post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Forum Posts</h1>

        <div className="mb-6">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={3}
            placeholder="Write your post..."
            className="w-full p-3 border rounded-lg"
          />
          <button
            onClick={handleCreatePost}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Post
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-50 p-4 rounded-lg mb-3 border"
            >
              <p className="text-gray-800">{post.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                Posted by: {post.userId?.username || "User"}
              </p>
            </div>
          ))
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default PostPage;