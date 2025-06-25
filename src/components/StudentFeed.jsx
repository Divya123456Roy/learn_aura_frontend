import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  getUserFeedAPI,
  createDiscussionAPI,
  updateDiscussionAPI,
  deleteDiscussionAPI,
  createReplyAPI,
  editReplyAPI,
  deleteReplyAPI,
} from "../services/feedAPI";
import { useSelector } from "react-redux";

// Validation schema for discussion and reply forms
const discussionSchema = Yup.object({
  title: Yup.string()
    .required("Question is required")
    .min(3, "Question must be at least 3 characters"),
});

const replySchema = Yup.object({
  content: Yup.string()
    .required("Reply is required")
    .min(3, "Reply must be at least 3 characters"),
});

// Inline CSS (updated for button positioning below date/time)
const styles = `
  .forum-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  .post {
    border: 1px solid #e5e7eb;
    margin-bottom: 15px;
    padding: 15px;
    border-radius: 8px;
    background-color: #ffffff;
  }
  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  .post-author {
    font-weight: bold;
    color: #1f2937;
  }
  .post-meta {
    text-align: right;
  }
  .post-date {
    color: #6b7280;
    font-size: 0.9em;
    display: block;
  }
  .post-content {
    margin-bottom: 10px;
  }
  .action-buttons {
    display: flex;
    gap: 8px;
    margin-top: 5px;
  }
  .action-buttons button {
    padding: 6px 12px; /* Matches Discussion.jsx */
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.9em;
  }
  .edit-button {
    background-color: #facc15; /* Yellow for edit */
  }
  .edit-button:hover {
    background-color: #eab308;
  }
  .delete-button {
    background-color: #ef4444; /* Red for delete */
  }
  .delete-button:hover {
    background-color: #dc2626;
  }
  .reply-section {
    margin-left: 20px;
    padding-left: 15px;
    border-left: 2px solid #f3f4f6;
  }
  .reply {
    border-bottom: 1px dashed #e5e7eb;
    padding: 10px 0;
    font-size: 0.95em;
  }
  .reply-meta {
    text-align: right;
  }
  .reply-author {
    font-weight: bold;
    color: #1f2937;
    margin-right: 5px;
  }
  .reply-date {
    color: #9ca3af;
    font-size: 0.85em;
    display: block;
  }
  .reply-content {
    margin-bottom: 5px;
  }
  .reply:last-child {
    border-bottom: none;
  }
  .post-form textarea, .reply-form textarea {
    width: 100%;
    height: 80px;
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    resize: none;
  }
  .post-form button, .reply-form button {
    padding: 8px 12px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .post-form button:hover, .reply-form button:hover {
    background-color: #2563eb;
  }
  .pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }
  .pagination button {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background-color: #ffffff;
    cursor: pointer;
  }
  .pagination button:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
  .pagination button:hover:not(:disabled) {
    background-color: #e5e7eb;
  }
  .error {
    color: #ef4444;
    font-size: 0.85em;
    margin-top: 4px;
  }
`;

const StudentFeed = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 2;
  const queryClient = useQueryClient();
  const [editingDiscussionId, setEditingDiscussionId] = useState(null);
  const [editDiscussionText, setEditDiscussionText] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const userID = useSelector((state) => state.auth?.id)

  // Fetch feed data
  const { data, isLoading, error } = useQuery({
    queryKey: ["feed", page],
    queryFn: () => getUserFeedAPI(page, itemsPerPage),
    keepPreviousData: true,
  });
  console.log(data);

  // Mutations
  const createDiscussionMutation = useMutation({
    mutationFn: createDiscussionAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]);
      toast.success("Question posted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to post question");
    },
  });

  const updateDiscussionMutation = useMutation({
    mutationFn: ({ id, data }) => updateDiscussionAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]);
      toast.success("Discussion updated!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update discussion");
    },
  });

  const deleteDiscussionMutation = useMutation({
    mutationFn: deleteDiscussionAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]);
      toast.success("Discussion deleted!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete discussion");
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: createReplyAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]);
      toast.success("Reply posted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to post reply");
    },
  });

  const editReplyMutation = useMutation({
    mutationFn: ({ id, data }) => editReplyAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]);
      toast.success("Reply updated!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update reply");
    },
  });

  const deleteReplyMutation = useMutation({
    mutationFn: deleteReplyAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]);
      toast.success("Reply deleted!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update reply");
    },
  });

  // Handlers
  const handleEditDiscussion = (id, title) => {
    setEditingDiscussionId(id);
    setEditDiscussionText(title);
  };

  const submitEditDiscussion = () => {
    if (!editingDiscussionId || !editDiscussionText.trim()) return;
    updateDiscussionMutation.mutate({
      id: editingDiscussionId,
      data: { title: editDiscussionText },
    });
    setEditingDiscussionId(null);
    setEditDiscussionText("");
  };

  const handleDeleteDiscussion = (id) => {
    if (!window.confirm("Are you sure you want to delete this discussion?")) return;
    deleteDiscussionMutation.mutate(id);
  };

  const handleEditReply = (id, content) => {
    setEditingReplyId(id);
    setEditReplyText(content);
  };

  const submitEditReply = () => {
    if (!editingReplyId || !editReplyText.trim()) return;
    editReplyMutation.mutate({
      id: editingReplyId,
      data: { content: editReplyText },
    });
    setEditingReplyId(null);
    setEditReplyText("");
  };

  const handleDeleteReply = (id) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;
    deleteReplyMutation.mutate(id);
  };

  const handleStartReply = (discussionId) => {
    setReplyingTo(discussionId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const discussions = data?.discussions || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="forum-container min-h-screen bg-gray-100">
      <style>{styles}</style>
      <ToastContainer />

      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Student Feed
      </h1>

      {/* New Discussion Form */}
      <Formik
        initialValues={{ title: "" }}
        validationSchema={discussionSchema}
        onSubmit={(values, { resetForm }) => {
          createDiscussionMutation.mutate({ title: values.title });
          resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="post-form">
            <Field
              as="textarea"
              name="title"
              placeholder="Ask a new question..."
              className="w-full"
            />
            <ErrorMessage name="title" component="div" className="error" />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting || createDiscussionMutation.isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                {createDiscussionMutation.isLoading ? (
                  <div className="animate-spin h-4 w-4 border-t-2 border-white rounded-full mr-2"></div>
                ) : null}
                Post Question
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Feed Items */}
      {isLoading && (
        <p className="text-gray-500 text-center">Loading feed...</p>
      )}
      {error && (
        <p className="text-red-500 text-center">
          {error.message || "Failed to load feed"}
        </p>
      )}
      {!isLoading && !error && discussions.length === 0 && (
        <p className="text-gray-500 text-center">No discussions yet. Be the first!</p>
      )}

      {discussions.map((discussion) => (
        <div key={discussion._id} className="post">
          {editingDiscussionId === discussion._id ? (
            <div className="flex flex-col gap-2 mb-4">
              <textarea
                value={editDiscussionText}
                onChange={(e) => setEditDiscussionText(e.target.value)}
                className="w-full"
              />
              <div className="flex gap-2">
                <button
                  onClick={submitEditDiscussion}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingDiscussionId(null);
                    setEditDiscussionText("");
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="post-header">
                <span className="post-author">{discussion.userId?.username || "User"}</span>
                <div className="post-meta">
                  <span className="post-date">
                    {new Date(discussion.createdAt).toLocaleString()}
                  </span>
                  {userID === discussion.userId?._id && (
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEditDiscussion(discussion._id, discussion.title)}
                        className="edit-button"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteDiscussion(discussion._id)}
                        className="delete-button"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="post-content">
                <p>
                  <Link
                    to={`/student/discussion/${discussion._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {discussion.title}
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* Latest Reply */}
          {discussion.latestReply && (
            <div className="reply-section">
              <h3 className="text-sm font-semibold">Latest Reply:</h3>
              {editingReplyId === discussion.latestReply._id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editReplyText}
                    onChange={(e) => setEditReplyText(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={submitEditReply}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingReplyId(null);
                        setEditReplyText("");
                      }}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="reply">
                  <div className="reply-content">
                    <span className="reply-author">
                      {discussion.latestReply.userId?.username || "User"}
                    </span>
                    <span className="reply-date">
                      {new Date(discussion.latestReply.reply.timestamp).toLocaleString()}
                    </span>
                    {(userID._id === discussion.latestReply.userId?._id ||
                      userID._id === discussion.userId?._id) && (
                      <div className="action-buttons">
                        <button
                          onClick={() =>
                            handleEditReply(
                              discussion.latestReply._id,
                              discussion.latestReply.reply.content
                            )
                          }
                          className="edit-button"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteReply(discussion.latestReply._id)}
                          className="delete-button"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                    <p>{discussion.latestReply.reply.content}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reply Form */}
          {replyingTo === discussion._id ? (
            <Formik
              initialValues={{ content: "" }}
              validationSchema={replySchema}
              onSubmit={(values, { resetForm }) => {
                createReplyMutation.mutate({
                  discussionId: discussion._id,
                  content: values.content,
                });
                resetForm();
                setReplyingTo(null);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="reply-form mt-4">
                  <Field
                    as="textarea"
                    name="content"
                    placeholder="Write your reply..."
                    className="w-full"
                  />
                  <ErrorMessage name="content" component="div" className="error" />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || createReplyMutation.isLoading}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      {createReplyMutation.isLoading ? (
                        <div className="animate-spin h-4 w-4 border-t-2 border-white rounded-full mr-2"></div>
                      ) : null}
                      Post Reply
                    </button>
                    <button
                      onClick={handleCancelReply}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <button
              onClick={() => handleStartReply(discussion._id)}
              className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
            >
              Reply
            </button>
          )}
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentFeed;