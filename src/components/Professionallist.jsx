import { useState, useEffect } from "react";
import { Search, Check, MessageSquare } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsersAPI,
  sendFriendRequestAPI,
} from "../services/userAPI";
import { useSelector } from "react-redux";

export default function Professionallist() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const queryClient = useQueryClient();
  const currentUserId = useSelector((state) => state.auth.id);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const { data: users, error, isLoading } = useQuery({
    queryKey: ["students", debouncedSearch],
    queryFn: () => fetchUsersAPI(debouncedSearch),
    select: (data) => data.filter((user) => user.role === "student"),
    onError: (error) => console.error("Fetch error:", error.message),
  });

  const friendRequestMutation = useMutation({
    mutationFn: sendFriendRequestAPI,
    onSuccess: (data, friendId) => {
      queryClient.setQueryData(["students", debouncedSearch], (oldData) =>
        oldData.map((user) =>
          user._id === friendId ? { ...user, hasPendingFriendRequest: true } : user
        )
      );
    },
    onError: (error) => {
      console.error("Error sending friend request:", error.message);
      queryClient.invalidateQueries(["students", debouncedSearch]);
    },
  });

  const handleFriendRequest = (friendId, hasPendingFriendRequest) => {
    if (!hasPendingFriendRequest) {
      friendRequestMutation.mutate(friendId);
    }
  };

  // Check if current user is in the user's friends list
  const isFriend = (user) => {
    return user?.friends?.some((friend) => friend === currentUserId);
  };

  // Check if current user has a pending friend request
  const isPendingFriend = (user) => {
    return user?.friendRequests?.some((friend) => friend === currentUserId);
  };

  return (
    <div className="p-4 w-full max-w-2xl mx-auto mt-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
        Students Directory
      </h2>

      <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search students by name..."
          className="w-full outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-4">
        {isLoading && <p className="text-center text-gray-500">Loading...</p>}
        {error && (
          <p className="text-center text-red-500">{error.message || "Error loading students"}</p>
        )}
        {!isLoading && (!users || users.length === 0) && (
          <p className="text-center text-gray-500">No students found.</p>
        )}

        {users?.map((user) => (
          <div
            key={user._id}
            className="flex justify-between items-center border p-4 rounded-lg mb-3 shadow-sm"
          >
            <div>
              <p className="font-semibold text-gray-800">{user.username}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500 capitalize">Role: {user.role}</p>
            </div>

            <div className="flex gap-2">
              {/* Friend Request Button */}
              {isFriend(user) ? (
                <button
                  className="flex items-center justify-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg transition-all text-sm cursor-not-allowed"
                  disabled
                >
                  <Check className="w-4 h-4" />
                  <span>Friends</span>
                </button>
              ) : isPendingFriend(user) ? (
                <button
                  className="flex items-center justify-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg transition-all text-sm cursor-not-allowed"
                  disabled
                >
                  <Check className="w-4 h-4" />
                  <span>Request Sent</span>
                </button>
              ) : (
                <button
                  onClick={() => handleFriendRequest(user._id, user.hasPendingFriendRequest)}
                  disabled={
                    user.hasPendingFriendRequest || friendRequestMutation.isLoading
                  }
                  className={`flex items-center justify-center gap-2 px-3 py-1 rounded-lg transition-all text-sm ${
                    user.hasPendingFriendRequest
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  } ${
                    friendRequestMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {friendRequestMutation.isLoading ? (
                    <div className="animate-spin h-4 w-4 border-t-2 border-white rounded-full"></div>
                  ) : user.hasPendingFriendRequest ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Request Sent</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}