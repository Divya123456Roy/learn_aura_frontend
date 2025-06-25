  import { useState, useEffect } from "react";
  import { Search, UserPlus, Check, User } from "lucide-react";
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import {
    fetchUsersAPI,
    followUserAPI,
    sendFriendRequestAPI,
  } from "../services/userAPI";
  import { useSelector } from "react-redux";

  export default function SearchUser() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const queryClient = useQueryClient();
    const currentUserId = useSelector((state) => state.auth.id);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedSearch(search);
      }, 500);
      return () => clearTimeout(handler);
    }, [search]);

    const { data: users, error, isLoading } = useQuery({
      queryKey: ["users", debouncedSearch],
      queryFn: () => fetchUsersAPI(debouncedSearch),
      onError: (error) => {
        console.error("Error fetching users:", error.message);
      },
    });

    const followMutation = useMutation({
      mutationFn: followUserAPI,
      onSuccess: (data, userId) => {
        queryClient.setQueryData(["users", debouncedSearch], (oldData) =>
          oldData.map((user) =>
            user._id === userId ? { ...user, isFollowing: true } : user
          )
        );
      },
      onError: (error) => {
        console.error("Error following user:", error.message);
        queryClient.invalidateQueries(["users", debouncedSearch]);
      },
    });

    const friendRequestMutation = useMutation({
      mutationFn: sendFriendRequestAPI,
      onSuccess: (data, friendId) => {
        queryClient.setQueryData(["users", debouncedSearch], (oldData) =>
          oldData.map((user) =>
            user._id === friendId
              ? { ...user, hasPendingFriendRequest: true }
              : user
          )
        );
      },
      onError: (error) => {
        console.error("Error sending friend request:", error.message);
        queryClient.invalidateQueries(["users", debouncedSearch]);
      },
    });

    const handleFollow = (userId, isFollowing) => {
      if (!isFollowing) {
        followMutation.mutate(userId);
      }
    };

    const handleFriendRequest = (friendId, hasPendingFriendRequest) => {
      if (!hasPendingFriendRequest) {
        friendRequestMutation.mutate(friendId);
      }
    };

    // Check if current user is in the user's friends list
    const isFriend = (user) => {
      return user?.friends?.some((friend) => friend === currentUserId);
    };

    const isPendingFriend = (user) => {
      return user?.friendRequests?.some((friend) => friend === currentUserId);
    };

    return (
      <div className="w-full h-screen p-4 bg-gray-100 overflow-hidden">
        <div className="h-full w-full flex flex-col items-center">
          {/* Header */}
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Search Users</h1>
            <p className="text-sm text-gray-500 mt-2">Find and connect with users.</p>
          </header>

          {/* Search Bar */}
          <div className="flex items-center w-full max-w-2xl gap-2 border border-gray-300 bg-white rounded-lg p-3 shadow-md">
            <Search className="text-gray-500" />
            <input
              type="text"
              placeholder="Search users by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-none outline-none text-sm bg-transparent"
            />
          </div>

          {/* Users List */}
          <div className="mt-6 w-full max-w-6xl h-[calc(100%-200px)] overflow-y-auto pr-2">
            {isLoading && (
              <p className="text-center text-gray-500">Loading users...</p>
            )}
            {error && (
              <p className="text-center text-red-500">
                {error.message || "Failed to fetch users"}
              </p>
            )}
            {!isLoading && !error && (!users || users.length === 0) && (
              <p className="text-center text-gray-500">No users found.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {users?.map((user) => (
                <div
                  key={user._id}
                  className="p-4 border border-gray-200 bg-white rounded-lg shadow-md flex flex-col justify-between"
                >
                  {/* User Info */}
                  <div className="mb-4">
                    <p className="font-semibold text-gray-800">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-500 capitalize">Role: {user.role}</p>
                    <p className="text-sm text-gray-500 capitalize">Gender: {user.gender}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {/* Follow Button - Hide if user is an instructor */}
                    {user.role !== "instructor" && (
                      <button
                        onClick={() => handleFollow(user._id, user.isFollowing)}
                        disabled={user.isFollowing || followMutation.isLoading}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                          user.isFollowing
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        } ${followMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {followMutation.isLoading ? (
                          <div className="animate-spin h-4 w-4 border-t-2 border-white rounded-full"></div>
                        ) : user.isFollowing ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Friend Button */}
                    {isFriend(user) ? (
                      <button
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg transition-all text-sm cursor-not-allowed"
                        disabled
                      >
                        <Check className="w-4 h-4" />
                        <span>Friends</span>
                      </button>
                    ) : isPendingFriend(user) ? (
                      <button
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg transition-all text-sm cursor-not-allowed"
                        disabled
                      >
                        <Check className="w-4 h-4" />
                        <span>Friend request sent</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFriendRequest(user._id, user.hasPendingFriendRequest)}
                        disabled={
                          user.hasPendingFriendRequest ||
                          friendRequestMutation.isLoading
                        }
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
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
                            <span>Requested</span>
                          </>
                        ) : (
                          <>
                            <User className="w-4 h-4" />
                            <span>Add Friend</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }