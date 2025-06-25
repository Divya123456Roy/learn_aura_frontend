import React, { useState, useEffect, useRef } from "react";
import {
  FaUsers,
  FaSearch,
  FaPaperPlane,
  FaSmile,
  FaTrash,
  FaFlag,
  FaPlus,
  FaUserPlus,
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import io from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../Utils/StorageHandler";
import { useSelector } from "react-redux";
import { getAllGroupsAPI } from "../services/groupService";
import { fetchMyFollowersAPI } from "../services/chatAPI";

const ChatMessaging = () => {
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
      console.log("Received Socket.IO message:", message);
      const chatKey = message.groupId || message.roomId;

      if (message.senderId._id === currentUserId) {
        return;
      }

      setMessages((prev) => {
        const existingMessages = prev[chatKey] || [];
        if (
          existingMessages.some(
            (msg) =>
              msg._id === message._id ||
              (msg.text === message.content &&
                msg.senderId === message.senderId._id &&
                Math.abs(new Date(msg.time) - new Date(message.createdAt || new Date())) < 1000)
          )
        ) {
          return prev;
        }
        const newMessage = {
          text: message.content,
          time: formatTime(message.createdAt || new Date()),
          senderId: message.senderId._id,
          senderName: message.senderId.username,
          _id: message._id,
        };
        return {
          ...prev,
          [chatKey]: [...existingMessages, newMessage],
        };
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
      setChats((prev) => {
        const updatedChats = prev.map((chat) =>
          chat.key === chatId
            ? {
                ...chat,
                lastMessage: lastMessage.content,
                updatedAt,
              }
            : chat
        );
        // Sort chats to move the updated chat to the top
        return updatedChats.sort((a, b) => {
          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return bTime - aTime;
        });
      });
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
            updatedAt: new Date().toISOString(), // Set initial updatedAt for new group
          },
          ...prev,
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
          name: `${friend.username} (${isMentor ? "Mentor" : "Peer"})`,
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
              <img src={group.groupImage} alt={group.groupName?.[0]?.toUpperCase() || "?"} />
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
      // Sort chats by updatedAt in descending order
      return updatedChats.sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bTime - aTime;
      });
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
    )
    ?.sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bTime - aTime;
    });

  const activeChatData = chats?.find((chat) => chat.key === activeChat);
  const isGroupChat = activeChatData?.type === "group";

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
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

        // Update chats to move the active chat to the top
        setChats((prev) => {
          const updatedChats = prev.map((chat) =>
            chat.key === activeChat
              ? {
                  ...chat,
                  lastMessage: values.message,
                  updatedAt: new Date().toISOString(),
                }
              : chat
          );
          return updatedChats.sort((a, b) => {
            const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            return bTime - aTime;
          });
        });

        socketRef.current.emit("sendMessage", messageData, async (response) => {
          console.log("Socket.IO response:", response);
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
              const res = await axios.post(url, messageData, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setMessages((prev) => {
                const existingMessages = prev[activeChat] || [];
                const newMessage = {
                  text: res.data.content,
                  time: formatTime(res.data.createdAt || new Date()),
                  senderId: res.data.senderId._id,
                  senderName: res.data.senderId.username,
                  _id: res.data._id,
                };
                return {
                  ...prev,
                  [activeChat]: [
                    ...existingMessages.filter((msg) => msg._id !== tempId),
                    newMessage,
                  ],
                };
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
              const newMessage = {
                text: values.message,
                time: formatTime(response.createdAt || new Date()),
                senderId: currentUserId,
                senderName: "You",
                _id: response.messageId,
              };
              return {
                ...prev,
                [activeChat]: [
                  ...existingMessages.filter((msg) => msg._id !== tempId),
                  newMessage,
                ],
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
    <div className="flex h-screen w-full bg-gray-100">
      <div className="w-1/3 bg-white shadow-lg p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">Chats</h1>
          <div className="flex gap-2 relative">
            {activeChatType === "individual" ? (
              <>
                <button
                  onClick={() => navigate("/student/search-users")}
                  className="text-xl hover:text-blue-500"
                  title="Search Users"
                  aria-label="Search Users"
                >
                  <FaSearch />
                </button>
                <button
                  onClick={() => navigate("/student/friend-request")}
                  className="text-xl hover:text-blue-500"
                  title="Friend Requests"
                  aria-label="Friend Requests"
                >
                  <FaUserPlus />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/student/search-group")}
                  className="text-xl hover:text-blue-500"
                  title="Find Groups"
                  aria-label="Find Groups"
                >
                  <FaSearch />
                </button>
                <button
                  onClick={() => setShowAddOptions(!showAddOptions)}
                  className="text-xl hover:text-green-500 relative"
                  title="Add New"
                  aria-label="Add New"
                >
                  <FaPlus />
                  {showAddOptions && (
                    <div className="absolute top-full left-0 bg-white shadow-md rounded-md mt-1 z-10">
                      <button
                        onClick={() => {
                          navigate("/student/create-group");
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

        <div className="mb-2">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full p-2 border rounded-lg text-sm text-gray-700 focus:ring-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <div className="flex">
            <button
              onClick={() => setActiveChatType("individual")}
              className={`flex-grow text-center py-2 font-semibold ${
                activeChatType === "individual"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setActiveChatType("group")}
              className={`flex-grow text-center py-2 font-semibold ${
                activeChatType === "group"
                  ? "border-b-2 border-purple-500 text-purple-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Group
            </button>
          </div>
        </div>

        <div className="flex flex-col h-[480px] overflow-y-auto">
          {isFriendsLoading ? (
            <p className="text-sm text-gray-500">Loading chats...</p>
          ) : (
            filteredChats?.map((chat) => (
              <div
                key={chat.key}
                onClick={() => setActiveChat(chat.key)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  activeChat === chat.key ? "bg-blue-100 shadow-md" : "hover:bg-gray-100"
                }`}
              >
                {chat.image}
                <div className="flex-1">
                  <span className="font-medium text-gray-800">
                    {activeChatType === "individual" ? chat.username : chat.name}
                  </span>
                  {chat.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                  )}
                </div>
              </div>
            ))
          )}

          {activeChatType === "group" && filteredChats?.length === 0 && !showCreateGroupInput && (
            <p className="text-sm text-gray-500">No group chats yet.</p>
          )}
          {activeChatType === "individual" && filteredChats?.length === 0 && (
            <p className="text-sm text-gray-500">No individual chats.</p>
          )}

          {activeChatType === "group" && showCreateGroupInput && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Group Name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm text-gray-700 mb-2"
              />
              <select
                multiple
                value={selectedMembers}
                onChange={(e) =>
                  setSelectedMembers(
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
                className="w-full p-2 border rounded-lg text-sm text-gray-700 mb-2"
              >
                {friendsData?.friends?.map((friend) => (
                  <option key={friend._id} value={friend._id}>
                    {friend.username}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateGroup}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateGroupInput(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-100">
        {activeChat ? (
          <>
            <div
              className="bg-white shadow p-4 flex items-center gap-3 cursor-pointer"
              onClick={() => isGroupChat && setShowGroupInfo(!showGroupInfo)}
            >
              {activeChatData?.image}
              <h2 className="text-lg font-semibold text-gray-800">
                {activeChatType === "individual" ? activeChatData?.username : activeChatData?.name}
              </h2>
              {isGroupChat && (
                <span className="ml-auto text-sm text-gray-500">
                  {showGroupInfo ? "Hide Info" : "Show Info"}
                </span>
              )}
            </div>

            {isGroupChat && showGroupInfo && (
              <div className="bg-white p-4 border-b">
                {(() => {
                  const group = groupsData?.find((group) => group._id === activeChatData?.groupId);
                  if (!group) return <p className="text-sm text-gray-500">Group information not available</p>;

                  return (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-md font-semibold text-gray-800 mb-2">Group Admin</h3>
                        {group.admins?.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600">
                                {group.admins[0].username?.[0]?.toUpperCase() || "?"}
                              </span>
                            </div>
                            <span className="text-sm text-gray-700">{group.admins[0].username}</span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No admin assigned</p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-md font-semibold text-gray-800 mb-2">Members</h3>
                        {group.members?.length > 0 ? (
                          <div className="max-h-40 overflow-y-auto">
                            <div className="grid grid-cols-1 gap-2">
                              {group.members.map((member) => (
                                <div key={member._id} className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-600">
                                      {member.username?.[0]?.toUpperCase() || "?"}
                                    </span>
                                  </div>
                                  <span className="text-sm text-gray-700">{member.username}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No members in this group</p>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-end max-h-[calc(100vh-180px)]">
              {(messages[activeChat] || []).map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.senderId === currentUserId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {isGroupChat && msg.senderId !== currentUserId && (
                      <p className="text-xs font-semibold">{msg.senderName}</p>
                    )}
                    <p>{msg.text}</p>
                    <div className="text-xs mt-1 flex justify-between items-center">
                      <span>{msg.time}</span>
                      {msg.senderId === currentUserId && (
                        <div className="flex gap-2 ml-2">
                          <button
                            onClick={() => deleteMessage(msg._id)}
                            className="hover:text-red-300"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() => reportSpam(msg._id)}
                            className="hover:text-yellow-300"
                            title="Report Spam"
                            aria-label="Report Spam"
                          >
                            <FaFlag />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white p-4 relative">
              {showEmojiPicker && (
                <div className="absolute bottom-16 left-0 z-20">
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
                  className="text-xl text-gray-600 hover:text-yellow-500"
                  aria-label="Toggle Emoji Picker"
                >
                  <FaSmile />
                </button>
                <textarea
                  name="message"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onKeyDown={handleEnterPress}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-lg text-sm text-gray-700 focus:ring-blue-300 resize-none"
                  rows="1"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                  aria-label="Send Message"
                >
                  <FaPaperPlane />
                </button>
              </form>
              {formik.errors.message && formik.touched.message && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.message}</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessaging;