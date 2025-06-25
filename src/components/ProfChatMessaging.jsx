import React, { useState, useEffect, useRef } from "react";
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  FaceSmileIcon,
  TrashIcon,
  FlagIcon,
  PlusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import EmojiPicker from "emoji-picker-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import io from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";
import { getAllGroupsAPI } from "../services/groupService";
import { fetchMyFollowersAPI } from "../services/chatAPI";

const ProfChatMessaging = () => {
  const queryClient = useQueryClient();
  const { data: friendsData, isLoading: isFriendsLoading } = useQuery({
    queryFn: fetchMyFollowersAPI,
    queryKey: ["chat-friends"],
  });
  const { data: groupsData, error: groupsError } = useQuery({
    queryKey: ["all-groups"],
    queryFn: getAllGroupsAPI,
  });
  const token = getToken();
  const [activeChat, setActiveChat] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState({});
  const messagesEndRef = useRef(null);
  const [showCreateGroupInput, setShowCreateGroupInput] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const currentUserId = useSelector((state) => state.auth.id);
  const navigate = useNavigate();
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [activeChatType, setActiveChatType] = useState("individual");
  const socketRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  useEffect(() => {
    const socket = io(`http://localhost:3005`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server with ID:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
    });

    const messageHandler = (message) => {
      const chatKey = message.groupId || message.roomId;
      setMessages((prev) => {
        const existingMessages = prev[chatKey] || [];
        if (existingMessages.some((msg) => msg._id === message._id)) {
          return prev;
        }
        const newMessage = {
          text: message.content,
          time: formatTime(message.createdAt),
          senderId: message.senderId._id,
          senderName: message.senderId.username,
          _id: message._id,
        };
        const updatedMessages = {
          ...prev,
          [chatKey]: [...existingMessages, newMessage],
        };
        return updatedMessages;
      });
    };
    socket.on("message", messageHandler);

    socket.on("chatUpdated", ({ chatId, lastMessage, updatedAt, chatType }) => {
      queryClient.setQueryData(
        [chatType === "individual" ? "chat-friends" : "all-groups"],
        (oldData) => {
          if (!oldData) return oldData;
          if (chatType === "individual") {
            return {
              ...oldData,
              friends: oldData.friends.map((friend) =>
                friend._id === chatId
                  ? {
                      ...friend,
                      lastMessage: lastMessage.content,
                      updatedAt,
                    }
                  : friend
              ),
            };
          } else {
            return oldData.map((group) =>
              group._id === chatId
                ? {
                    ...group,
                    lastMessage: lastMessage.content,
                    updatedAt,
                  }
                : group
            );
          }
        }
      );
      setChats((prev) =>
        prev.map((chat) =>
          chat.key === chatId
            ? {
                ...chat,
                lastMessage: lastMessage.content,
                updatedAt,
              }
            : chat
        )
      );
    });

    socket.on("groupCreated", (group) => {
      queryClient.setQueryData(["all-groups"], (oldData) => {
        if (!oldData) return [group];
        if (oldData.some((g) => g._id === group._id)) return oldData;
        return [...oldData, group];
      });
      setChats((prev) => {
        if (prev.some((chat) => chat.key === group._id)) return prev;
        return [
          ...prev,
          {
            name: group.groupName,
            image: (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600">{group.groupName?.[0]?.toUpperCase()}</span>
              </div>
            ),
            key: group._id,
            type: "group",
            groupId: group._id,
          },
        ];
      });
      socket.emit("joinRoom", { roomId: group._id });
    });

    socket.on("error", (error) => {
      console.error("Socket.IO error:", error);
    });

    return () => {
      socket.off("message", messageHandler);
      socket.off("chatUpdated");
      socket.off("groupCreated");
      socket.off("error");
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [token, queryClient]);

  useEffect(() => {
    if (!socketRef.current) return;
    const socket = socketRef.current;

    chats.forEach((chat) => {
      const roomId =
        chat.type === "group"
          ? chat.groupId
          : [currentUserId, chat.otherUserId].sort().join("_");
      socket.emit("joinRoom", { roomId });
      console.log(`Joined room: ${roomId}`);
    });

    return () => {
      chats.forEach((chat) => {
        const roomId =
          chat.type === "group"
            ? chat.groupId
            : [currentUserId, chat.otherUserId].sort().join("_");
        socket.emit("leaveRoom", { roomId });
        console.log(`Left room: ${roomId}`);
      });
    };
  }, [chats, currentUserId]);

  useEffect(() => {
    const transformedChats = [];

    if (friendsData?.friends) {
      const friendChats = friendsData.friends.map((friend) => {
        const role = friend.role || "peer";
        const isMentor = role === "mentor";
        const profilePicture = friend.profile?.profilePicture || "/default-avatar.png";
        return {
          name: `${friend.username} (${isMentor ? "Mentor" : "Colleague"})`,
          username: friend.username,
          image: (
            <img
              src={profilePicture}
              alt={`${friend.username}'s profile`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ),
          key: friend._id,
          type: isMentor ? "mentor" : "peer",
          otherUserId: friend._id,
          lastMessage: friend.lastMessage,
          updatedAt: friend.updatedAt,
        };
      });
      transformedChats.push(...friendChats);
    }

    if (groupsData) {
      const groupChats = groupsData
        .filter((group) =>
          Array.isArray(group.members) &&
          group.members.some((member) => member._id === currentUserId)
        )
        .map((group) => ({
          name: group.groupName,
          image: (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600">{group.groupName?.[0]?.toUpperCase() || "?"}</span>
            </div>
          ),
          key: group._id,
          type: "group",
          groupId: group._id,
          lastMessage: group.lastMessage,
          updatedAt: group.updatedAt,
        }));
      transformedChats.push(...groupChats);
    }

    setChats((prev) => {
      const updatedChats = transformedChats.map((newChat) => {
        const existingChat = prev.find((chat) => chat.key === newChat.key);
        return {
          ...newChat,
          lastMessage: existingChat?.lastMessage || newChat.lastMessage,
          updatedAt: existingChat?.updatedAt || newChat.updatedAt,
        };
      });
      return updatedChats;
    });
  }, [friendsData, groupsData, currentUserId]);

  useEffect(() => {
    if (activeChat) {
      const activeChatData = chats.find((chat) => chat.key === activeChat);
      if (!activeChatData) return;

      const fetchChatHistory = async () => {
        try {
          const url =
            activeChatType === "individual"
              ? `${BASE_URL}/chat/users/${currentUserId}/${activeChatData.otherUserId}`
              : `${BASE_URL}/chat/groups/${activeChatData.groupId}`;
          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessages((prev) => ({
            ...prev,
            [activeChat]: response?.data?.map((msg) => ({
              text: msg.content,
              time: formatTime(msg.createdAt),
              senderId: msg.senderId._id,
              senderName: msg.senderId.username,
              _id: msg._id,
            })),
          }));
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      };

      fetchChatHistory();
    }
  }, [activeChat, activeChatType, chats, currentUserId, token]);

  useEffect(() => {
    if (activeChat && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeChat]);

  const filteredChats = chats
    ?.filter((chat) =>
      activeChatType === "individual"
        ? chat.type === "peer" || chat.type === "mentor"
        : chat.type === "group"
    )
    ?.filter((chat) =>
      (activeChatType === "individual" ? chat.username : chat.name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const activeChatData = chats?.find((chat) => chat.key === activeChat);
  const isGroupChat = activeChatData?.type === "group";

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleCreateGroup = async () => {
    if (!newGroupName || selectedMembers.length === 0) {
      alert("Please provide a group name and select members.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/group/create`,
        {
          groupName: newGroupName,
          members: [...selectedMembers, currentUserId],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      queryClient.invalidateQueries({ queryKey: ["all-groups"] });
      socketRef.current.emit("groupCreated", response.data);
      setNewGroupName("");
      setSelectedMembers([]);
      setShowCreateGroupInput(false);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group.");
    }
  };

 
  const formik = useFormik({
    initialValues: { message: "" },
    validationSchema: Yup.object({
      message: Yup.string().trim().required("Message cannot be empty"),
    }),
    onSubmit: async (values) => {
      if (!activeChat) {
        console.error("No active chat selected");
        return;
      }

      const activeChatData = chats.find((chat) => chat.key === activeChat);
      if (!activeChatData) {
        console.error("Active chat data not found for key:", activeChat);
        return;
      }

      const roomId =
        activeChatType === "individual"
          ? [currentUserId, activeChatData.otherUserId].sort().join("_")
          : activeChatData.groupId;

      const messageData = {
        senderId: currentUserId,
        message: values.message,
        roomId,
        ...(activeChatType === "individual" && { receiverId: activeChatData.otherUserId }),
        ...(activeChatType === "group" && { groupId: activeChatData.groupId }),
      };

      try {
        const tempId = `temp-${Date.now()}-${Math.random()}`;
        const optimisticMessage = {
          text: values.message,
          time: formatTime(new Date()),
          senderId: currentUserId,
          senderName: "You",
          _id: tempId,
        };
        setMessages((prev) => ({
          ...prev,
          [activeChat]: [...(prev[activeChat] || []), optimisticMessage],
        }));

        socketRef.current.emit("sendMessage", messageData, async (response) => {
          if (response?.status !== "success") {
            console.error("Failed to send message:", response?.error || "Unknown error");
            setMessages((prev) => ({
              ...prev,
              [activeChat]: prev[activeChat].filter((msg) => msg._id !== tempId),
            }));
            try {
              const url =
                activeChatType === "individual"
                  ? `${BASE_URL}/chat/message`
                  : `${BASE_URL}/chat/group/message`;
              await axios.post(url, messageData, {
                headers: { Authorization: `Bearer ${token}` },
              });
              queryClient.invalidateQueries({
                queryKey: [activeChatType === "individual" ? "chat-friends" : "all-groups"],
              });
            } catch (error) {
              console.error("HTTP fallback failed:", error.response?.data || error.message);
            }
          } else {
            setMessages((prev) => {
              const existingMessages = prev[activeChat] || [];
              return {
                ...prev,
                [activeChat]: existingMessages.map((msg) =>
                  msg._id === tempId
                    ? {
                        text: values.message,
                        time: formatTime(new Date()),
                        senderId: currentUserId,
                        senderName: "You",
                        _id: response.messageId,
                      }
                    : msg
                ),
              };
            });
          }
        });

        formik.resetForm();
        setShowEmojiPicker(false);
      } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
        setMessages((prev) => ({
          ...prev,
          [activeChat]: prev[activeChat].filter((msg) => msg._id !== tempId),
        }));
      }
    },
  });

  const reportSpam = (msgId) => {
    console.log(`Message ${msgId} reported as spam.`);
  };

  const deleteMessage = (msgId) => {
    setMessages((prev) => ({
      ...prev,
      [activeChat]: prev[activeChat].filter((msg) => msg._id !== msgId),
    }));
  };

  const handleEnterPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      formik.handleSubmit();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-inter">

      <div className="w-80 bg-white shadow-md p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Conversations</h1>
          <div className="flex gap-2 relative">
            {activeChatType === "individual" ? (
              <>
                <button
                  onClick={() => navigate("/professional/prof-list")}
                  className="p-2 text-gray-600 hover:text-indigo-600"
                  title="Search Users"
                  aria-label="Search Users"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/professional/prof-friend")}
                  className="p-2 text-gray-600 hover:text-indigo-600"
                  title="Contact Requests"
                  aria-label="Contact Requests"
                >
                  <UserPlusIcon className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowAddOptions(!showAddOptions)}
                  className="p-2 text-gray-600 hover:text-indigo-600 relative"
                  title="Add New"
                  aria-label="Add New"
                >
                  <PlusIcon className="w-5 h-5" />
                  {showAddOptions && (
                    <div className="absolute top-full right-0 bg-white shadow-lg rounded-md mt-1 z-10 w-40">
                      <button
                        onClick={() => {
                          navigate("/professional/create-group");
                          setShowAddOptions(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Create Group
                      </button>
                    </div>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full p-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-indigo-300 focus:border-indigo-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveChatType("individual")}
              className={`flex-grow text-center py-2 text-sm font-medium ${
                activeChatType === "individual"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setActiveChatType("group")}
              className={`flex-grow text-center py-2 text-sm font-medium ${
                activeChatType === "group"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Group
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isFriendsLoading ? (
            <p className="text-sm text-gray-500 text-center">Loading conversations...</p>
          ) : filteredChats?.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              {activeChatType === "individual"
                ? "No individual conversations."
                : "No group conversations."}
            </p>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.key}
                onClick={() => setActiveChat(chat.key)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  activeChat === chat.key ? "bg-indigo-50" : "hover:bg-gray-100"
                }`}
              >
                {chat.image}
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    {activeChatType === "individual" ? chat.username : chat.name}
                  </span>
                  {chat.lastMessage && (
                    <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                  )}
                </div>
              </div>
            ))
          )}

          {activeChatType === "group" && showCreateGroupInput && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Enter group name"
                className="w-full p-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-indigo-300 focus:border-indigo-300"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <select
                multiple
                value={selectedMembers}
                onChange={(e) =>
                  setSelectedMembers(
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
                className="w-full p-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-indigo-300 focus:border-indigo-300 mt-2"
              >
                {friendsData?.friends?.map((friend) => (
                  <option key={friend._id} value={friend._id}>
                    {friend.username}
                  </option>
                ))}
              </select>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleCreateGroup}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
                >
                  Create Group
                </button>
                <button
                  onClick={() => setShowCreateGroupInput(false)}
                  className="text-gray-600 text-sm hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div
              className="bg-white shadow-sm p-4 flex items-center justify-between cursor-pointer"
              onClick={() => isGroupChat && setShowGroupInfo(!showGroupInfo)}
            >
              <div className="flex items-center gap-3">
                {activeChatData?.image}
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeChatType === "individual" ? activeChatData?.username : activeChatData?.name}
                </h2>
              </div>
              <div className="flex gap-2">
                {isGroupChat && (
                  <span className="text-sm text-gray-500">
                    {showGroupInfo ? "Hide Info" : "Show Info"}
                  </span>
                )}
              </div>
            </div>

            {isGroupChat && showGroupInfo && (
              <div className="bg-white p-4 border-b border-gray-200 shadow-sm">
                {groupsData?.find((group) => group._id === activeChatData?.groupId) ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Group Admin</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 text-xs">
                            {groupsData
                              .find((group) => group._id === activeChatData?.groupId)
                              ?.admins[0]?.username?.[0]?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <span className="text-sm text-gray-700">
                          {groupsData.find((group) => group._id === activeChatData?.groupId)?.admins[0]
                            ?.username || "Unknown"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Members</h3>
                      <div className="max-h-40 overflow-y-auto grid grid-cols-1 gap-2">
                        {groupsData
                          .find((group) => group._id === activeChatData?.groupId)
                          ?.members?.map((member) => (
                            <div key={member._id} className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 text-xs">
                                  {member.username?.[0]?.toUpperCase() || "?"}
                                </span>
                              </div>
                              <span className="text-sm text-gray-700">{member.username}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Group information not available</p>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 max-h-[calc(100vh-180px)]">
              {(messages[activeChat] || []).map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div
                    className={`max-w-md p-3 rounded-lg shadow-sm ${
                      msg.senderId === currentUserId ? "bg-indigo-600 text-white" : "bg-white text-gray-900"
                    }`}
                  >
                    {isGroupChat && msg.senderId !== currentUserId && (
                      <p className="text-xs font-semibold">{msg.senderName}</p>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <div className="text-xs mt-1 flex justify-between items-center">
                      <span>{msg.time}</span>
                      {msg.senderId === currentUserId && (
                        <div className="flex gap-2 ml-2">
                          <button
                            onClick={() => deleteMessage(msg._id)}
                            className="hover:text-red-300"
                            title="Delete Message"
                            aria-label="Delete Message"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => reportSpam(msg._id)}
                            className="hover:text-yellow-300"
                            title="Report Spam"
                            aria-label="Report Spam"
                          >
                            <FlagIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white p-4 shadow-sm relative">
              {showEmojiPicker && (
                <div className="absolute bottom-16 left-4 z-20">
                  <EmojiPicker
                    onEmojiClick={(emojiObject) =>
                      formik.setFieldValue("message", formik.values.message + emojiObject.emoji)
                    }
                  />
                </div>
              )}
              <form onSubmit={formik.handleSubmit} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-600 hover:text-indigo-600"
                  aria-label="Toggle Emoji Picker"
                >
                  <FaceSmileIcon className="w-5 h-5" />
                </button>
                <textarea
                  name="message"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onKeyDown={handleEnterPress}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-indigo-300 focus:border-indigo-300 resize-none"
                  rows="2"
                />
                <button
                  type="submit"
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  aria-label="Send Message"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </form>
              {formik.errors.message && formik.touched.message && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.message}</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500 text-sm">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfChatMessaging;