import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Check, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../Utils/StorageHandler";
import {
  fetchFriendRequestsAPI,
  acceptFriendRequestAPI,
  rejectFriendRequestAPI,
} from "../services/userAPI";
import { useNavigate } from "react-router-dom";

export default function ProfFriendRequests() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const queryClient = useQueryClient();
  const token = getToken();
  const navigate=useNavigate();
  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timeout);
  }, [search]);

  // Fetch friend requests
  const {
    data: friendRequests = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["friendRequests", debouncedSearch],
    queryFn: fetchFriendRequestsAPI,
    enabled: !!token, // Only fetch if token exists
    select: (data) =>
      data?.friendRequests?.filter((request) =>
        request?.username?.toLowerCase().includes(debouncedSearch.toLowerCase())
      ) || [],
    onError: (error) => {
      console.error("Error fetching friend requests:", error.message);
      toast.error(error.message || "Failed to fetch friend requests.");
    },
  });

  // Mutation for accepting friend request
  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequestAPI,
    onSuccess: (data, friendId) => {
      toast.success(data.message || "Friend request accepted!");
      queryClient.setQueryData(["friendRequests", debouncedSearch], (old) =>
        old.filter((request) => request._id !== friendId)
      );
    },
    onError: (error) => {
      console.error("Error accepting friend request:", error.message);
      toast.error(error.message || "Failed to accept friend request.");
    },
  });

  // Mutation for rejecting friend request
  const rejectMutation = useMutation({
    mutationFn: rejectFriendRequestAPI,
    onSuccess: (data, friendId) => {
      toast.success(data.message || "Friend request rejected.");
      queryClient.setQueryData(["friendRequests", debouncedSearch], (old) =>
        old.filter((request) => request._id !== friendId)
      );
    },
    onError: (error) => {
      console.error("Error rejecting friend request:", error.message);
      toast.error(error.message || "Failed to reject friend request.");
    },
  });

  // Handle accept/reject actions
  const handleAcceptRequest = (friendId) => {
    acceptMutation.mutate(friendId);
    navigate("/professional/chat")
  };

  const handleRejectRequest = (friendId) => {
    rejectMutation.mutate(friendId);
  };

  return (
    <div className="p-4 w-full max-w-2xl mt-4 mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
        Student Friend Requests
      </h2>

      {/* Search Bar */}
      <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 mb-4">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by username..."
          className="w-full outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Content */}
      <div className="mt-4">
        {!token && (
          <p className="text-center text-gray-500">
            Please log in to view friend requests.
          </p>
        )}
        {token && isLoading && (
          <p className="text-center text-gray-500">Loading...</p>
        )}
        {token && error && (
          <p className="text-center text-red-500">
            {error.message || "Error loading friend requests"}
          </p>
        )}
        {token && !isLoading && friendRequests.length === 0 && (
          <p className="text-center text-gray-500">No pending friend requests.</p>
        )}

        {token && !isLoading && friendRequests.length > 0 && (
          <div className="space-y-3">
            {friendRequests.map((request) => (
              <div
                key={request._id}
                className="flex justify-between items-center border p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">
                      {request.username?.[0]?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {request.username}
                    </p>
                    <p className="text-sm text-gray-500">{request.email}</p>
                    <p className="text-sm text-gray-500">{request.role}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request._id)}
                    disabled={acceptMutation.isLoading}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                    title={`Accept friend request from ${request.username}`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request._id)}
                    disabled={rejectMutation.isLoading}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                    title={`Reject friend request from ${request.username}`}
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}