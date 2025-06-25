import React, { useState } from "react";
import { Bell, CheckCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNotificationsAPI, getNotificationsAPI, markAsReadAPI } from "../services/notificationServices";

const Notification = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 4;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notification", page],
    queryFn: () => getNotificationsAPI(page, limit),
  });

  const notifications = data?.notifications || [];
  const pagination = data?.pagination || {};

  const { mutateAsync: markAsRead } = useMutation({
    mutationFn: markAsReadAPI,
    mutationKey: ["read-notification"],
    onSuccess: () => {
      queryClient.invalidateQueries(["notification"]);
    },
  });

  const { mutateAsync: deleteAllNotifications } = useMutation({
    mutationFn: deleteNotificationsAPI,
    mutationKey: ["delete-all-notification"],
    onSuccess: () => {
      queryClient.invalidateQueries(["notification"]);
    },
  });

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications();
    } catch (err) {
      console.error("Failed to delete all notifications:", err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 mt-4 shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold flex items-center text-blue-600">
          <Bell className="mr-2" /> Notifications
        </h1>
        {notifications.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="flex items-center text-red-600 hover:text-red-800 font-semibold transition"
          >
            <Trash2 className="w-5 h-5 mr-1" /> Delete All
          </button>
        )}
      </div>
      {notifications.length === 0 && !isLoading ? (
        <p className="text-gray-500">No new notifications</p>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 bg-white border rounded-lg shadow-md hover:bg-gray-100 transition ${
                notification.isRead ? "opacity-50" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium capitalize">
                    {notification.type.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="text-green-600 hover:text-green-800 transition"
                    title="Mark as Read"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition"
              >
                <ChevronLeft className="w-5 h-5 mr-1" /> Previous
              </button>
              <span className="text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.totalPages}
                className="flex items-center text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition"
              >
                Next <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          )}
        </div>
      ) : isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : isError ? (
        <p className="text-red-500">{error.message}</p>
      ) : null}
    </div>
  );
};

export default Notification;