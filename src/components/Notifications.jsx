import React, { useState } from 'react';
import { Bell, CheckCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteNotificationsAPI, getNotificationsAPI, markAsReadAPI } from '../services/notificationServices';
import parse from 'html-react-parser'; // For parsing HTML safely

const Notifications = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const limit = 4;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['notification', page],
        queryFn: () => getNotificationsAPI(page, limit),
    });

    const notifications = data?.notifications || [];
    const pagination = data?.pagination || {};

    const { mutateAsync: markAsRead } = useMutation({
        mutationFn: markAsReadAPI,
        mutationKey: ['read-notification'],
        onSuccess: () => {
            queryClient.invalidateQueries(['notification']);
        },
    });

    const { mutateAsync: deleteAllNotifications } = useMutation({
        mutationFn: deleteNotificationsAPI,
        mutationKey: ['delete-all-notification'],
        onSuccess: () => {
            queryClient.invalidateQueries(['notification']);
        },
    });

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markAsRead(notificationId);
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const handleDeleteAll = async () => {
        try {
            await deleteAllNotifications();
        } catch (err) {
            console.error('Failed to delete all notifications:', err);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
            <div className="w-full max-w-5xl bg-white shadow-xl rounded-xl p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-600 flex items-center">
                        <Bell className="w-8 h-8 mr-3" /> Notifications
                    </h1>
                    {notifications.length > 0 && (
                        <button
                            onClick={handleDeleteAll}
                            className="flex items-center text-red-600 hover:text-red-800 font-semibold transition"
                        >
                            <Trash2 className="w-6 h-6 mr-2" /> Delete All
                        </button>
                    )}
                </div>

                {/* Notifications Content */}
                <div className="space-y-4">
                    {isLoading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : isError ? (
                        <p className="text-center text-red-500">{error.message}</p>
                    ) : notifications.length === 0 ? (
                        <p className="text-center text-gray-500">No new notifications</p>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-5 border rounded-lg shadow-sm hover:bg-gray-50 transition flex justify-between items-start ${
                                    notification.isRead ? 'opacity-60' : ''
                                }`}
                            >
                                <div>
                                    <p className="font-semibold capitalize mb-1 text-gray-800">
                                        {notification.type.replace(/([A-Z])/g, ' $1').trim()}
                                    </p>
                                    <p className="text-sm text-gray-600">{parse(notification.message)}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                {!notification.isRead && (
                                    <button
                                        onClick={() => handleMarkAsRead(notification._id)}
                                        className="text-green-600 hover:text-green-800 transition"
                                        title="Mark as Read"
                                    >
                                        <CheckCircle className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="flex items-center text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition"
                        >
                            <ChevronLeft className="w-5 h-5 mr-2" /> Previous
                        </button>
                        <span className="text-gray-700 font-medium">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === pagination.totalPages}
                            className="flex items-center text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition"
                        >
                            Next <ChevronRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
