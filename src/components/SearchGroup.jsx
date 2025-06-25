import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../Utils/StorageHandler';
import { getAllGroupsAPI, joinGroupAPI } from '../services/groupService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const SearchGroup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const token = getToken();
  const queryClient = useQueryClient();
  const currentUserId = useSelector((state) => state.auth.id);
  const navigate = useNavigate();

  // Query for all groups
  const { data, isLoading, error } = useQuery({
    queryKey: ['all-groups'],
    queryFn: getAllGroupsAPI,
    enabled: !!token,
  });

  // Query for groups (used for groupChats)
  const { data: groupsData, error: groupsError } = useQuery({
    queryKey: ['all-groups'],
    queryFn: getAllGroupsAPI,
  });

  // Filter groups that the user is a member of
  const groupChats = groupsData
    ?.filter((group) =>
      Array.isArray(group.members) &&
      group.members.some((member) => member._id === currentUserId)
    ) || [];

  // Log data for debugging
  console.log('API Data:', data);

  // Mutation for joining a group
  const joinGroupMutation = useMutation({
    mutationFn: joinGroupAPI,
    onSuccess: (response, groupId) => {
      toast.success(response.message || 'Successfully joined the group!');
      queryClient.invalidateQueries(['all-groups']);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to join the group.');
    },
  });

  // Handle error from useQuery
  if (error || groupsError) {
    toast.error(error?.message || groupsError?.message || 'Failed to fetch groups.');
  }

  // Filter groups based on search term
  const filteredGroups = (data || []).filter((group) =>
    group?.groupName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Groups</h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by group name"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {!token ? (
        <p className="text-gray-600 text-center">Please log in to view groups.</p>
      ) : isLoading ? (
        <div className="flex justify-center">
          <svg
            className="animate-spin h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 12a8 8 0 018-8m0 16a8 8 0 01-8-8m8 8a8 8 0 008-8m-16 0a8 8 0 018 8"
            />
          </svg>
        </div>
      ) : filteredGroups.length === 0 ? (
        <p className="text-gray-600 text-center">No groups found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredGroups.map((group) => {
            const isMember = groupChats.some((chat) => chat._id === group._id);
            return (
              <li
                key={group._id}
                className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600">
                      {group.groupName?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{group.groupName}</p>
                    <p className="text-sm text-gray-500">{group.description || 'No description'}</p>
                  </div>
                </div>
                {isMember ? (
                  <Link to="/student/chat-messaging"
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    title={`View ${group.groupName}`}
                    aria-label={`View ${group.groupName}`}
                  >
                    View Group
                  </Link>
                ) : (
                  <button
                    onClick={() => joinGroupMutation.mutate(group._id)}
                    disabled={joinGroupMutation.isLoading}
                    className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      joinGroupMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title={`Join ${group.groupName}`}
                    aria-label={`Join ${group.groupName}`}
                  >
                    {joinGroupMutation.isLoading ? 'Joining...' : 'Join Group'}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SearchGroup;