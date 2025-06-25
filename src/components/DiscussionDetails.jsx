import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { getDiscussionByIdAPI, getReplyByIdAPI } from "../services/discussionAPI";

// Inline CSS (kept as provided, with highlighted reply styling)
const styles = `
  .discussion-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  .discussion-header {
    border: 1px solid #e5e7eb;
    padding: 15px;
    border-radius: 8px;
    background-color: #ffffff;
    margin-bottom: 15px;
  }
  .discussion-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 10px;
  }
  .discussion-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #6b7280;
    font-size: 0.9em;
  }
  .reply-section {
    margin-top: 20px;
  }
  .reply {
    border-bottom: 1px dashed #e5e7eb;
    padding: 10px 0;
    font-size: 0.95em;
  }
  .reply:last-child {
    border-bottom: none;
  }
  .reply.highlighted {
    background-color: #f0f9ff;
    border: 1px solid #bfdbfe;
    border-radius: 4px;
    padding: 12px;
  }
  .reply-author {
    font-weight: bold;
    color: #1f2937;
    margin-right: 5px;
  }
  .reply-date {
    color: #9ca3af;
    font-size: 0.85em;
  }
  .reply-content {
    margin-top: 5px;
    color: #374151;
  }
`;

const DiscussionDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const replyId = searchParams.get("replyId");

  // Fetch discussion details
  const { data: discussionData, isLoading: isLoadingDiscussion, error: discussionError } = useQuery({
    queryKey: ["discussion", id],
    queryFn: () => getDiscussionByIdAPI(id),
  });
  console.log(discussionData);
  


  return (
    <div className="discussion-container min-h-screen bg-gray-100">
      <style>{styles}</style>

      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Discussion Details
      </h1>

      {isLoadingDiscussion && (
        <p className="text-gray-500 text-center">Loading discussion...</p>
      )}
      {discussionError && (
        <p className="text-red-500 text-center">
          {discussionError.response?.data?.message || "Failed to load discussion"}
        </p>
      )}
      {!isLoadingDiscussion && !discussionError && !discussionData && (
        <p className="text-gray-500 text-center">Discussion not found</p>
      )}

      {discussionData && (
        <div className="discussion-header">
          <h2 className="discussion-title">{discussionData.discussion?.title}</h2>
          <div className="discussion-meta">
            <span>Posted by {discussionData.discussion?.userId?.username || "User"}</span>
            <span>{new Date(discussionData.discussion?.createdAt).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Specific Reply (Highlighted) */}
      {replyId && isLoadingReply && (
        <p className="text-gray-500 text-center">Loading specific reply...</p>
      )}
      {replyId && replyError && (
        <p className="text-red-500 text-center">
          {replyError.response?.data?.message || "Failed to load reply"}
        </p>
      )}
      {replyId && specificReply && (
        <div className="reply-section">
          <h3 className="text-lg font-semibold mb-2">Highlighted Reply</h3>
          <div className="reply highlighted">
            <div>
              <span className="reply-author">{specificReply.userId?.username || "User"}</span>
              <span className="reply-date">
                {new Date(specificReply.reply.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="reply-content">{specificReply.reply.content}</p>
          </div>
        </div>
      )}

      {/* All Replies */}
      {discussionData && (
        <div className="reply-section">
          <h3 className="text-lg font-semibold mb-2">Replies</h3>
          {discussionData.replies?.length === 0 && (
            <p className="text-gray-500 text-center">No replies yet.</p>
          )}
          {discussionData.replies?.map((reply) => (
            <div key={reply._id} className={`reply ${reply._id === replyId ? 'highlighted' : ''}`}>
              <div>
                <span className="reply-author">{reply.userId?.username || "User"}</span>
                <span className="reply-date">
                  {new Date(reply?.updatedAt).toLocaleString()}
                </span>
              </div>
              <p className="reply-content">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionDetails;