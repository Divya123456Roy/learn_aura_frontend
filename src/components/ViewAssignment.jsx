import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { fetchAllAssignmentByCourseAPI, updateAssignmentAPI, deleteAssignmentAPI } from "../services/assignmentAPI";
import { FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewAssignment = () => {
  const { courseId, moduleId } = useParams();
  const queryClient = useQueryClient();
  const [editAssignment, setEditAssignment] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    moduleId: "",
  });

  const { data: assignments, isError: error, isLoading: loading } = useQuery({
    queryKey: ["view-assignment", courseId],
    queryFn: () => fetchAllAssignmentByCourseAPI(moduleId),
    onError: (error) => {
      toast.error(error.message || "Failed to fetch assignments");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ assignmentId, data }) => updateAssignmentAPI(assignmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["view-assignment", courseId]);
      toast.success("Assignment updated successfully");
      setEditAssignment(null);
      setFormData({ title: "", description: "", dueDate: "", moduleId: "" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update assignment");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAssignmentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["view-assignment", courseId]);
      toast.success("Assignment deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete assignment");
    },
  });

  const handleEditClick = (assign) => {
    setEditAssignment(assign._id);
    setFormData({
      title: assign.title,
      description: assign.description,
      moduleId: assign.moduleId._id || assign.moduleId,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ assignmentId: editAssignment, data: formData });
  };

  const handleEditCancel = () => {
    setEditAssignment(null);
    setFormData({ title: "", description: "", dueDate: "", moduleId: "" });
  };

  const handleDelete = (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      deleteMutation.mutate(assignmentId);
    }
  };

  const handleVerifyAssignment = (assignmentId, assignmentTitle) => {
    toast.success(`Assignment "${assignmentTitle}" verified successfully`);
    // In a real app, this could trigger an API call to verify the assignment
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-10">
        <h3 className="text-2xl font-bold mb-6">Course Assignments</h3>
        <ul className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="bg-gray-800 p-4 rounded-lg shadow-md animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        Error loading assignments: {error.message}
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-10">  
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Assignments</h3>
        <button
          onClick={() => navigate(`/professional/${courseId}/${moduleId}/create-assignment`)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Create New Assignment
        </button>
      </div>
      <div className="text-center">No assignment for this module</div>
      </div>
    );
  }

  console.log(assignments);
  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">  
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Assignments</h3>
        <button
          onClick={() => navigate(`/professional/${courseId}/${moduleId}/create-assignment`)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Create New Assignment
        </button>
      </div>
      <ul className="space-y-4">
        {assignments.map((assign) => (
          <li
            key={assign._id}
            className="bg-gray-800 p-4 rounded-lg shadow-md"
          >
            {editAssignment === assign._id ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={updateMutation.isLoading}
                  >
                    {updateMutation.isLoading ? "Updating..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">
                    <strong>Title:</strong> {assign.title}
                  </p>
                  <p className="text-sm">
                    <strong>Description:</strong> {assign.description}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate(`/professional/${courseId}/${moduleId}/${assign._id}/mark`)}
                    className="p-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    title="Verify assignment"
                    aria-label={`Verify assignment ${assign.title}`}
                  >
                    <FaCheckCircle size={16} />
                  </button>
                  <button
                    onClick={() => handleEditClick(assign)}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    title="Edit assignment"
                    aria-label={`Edit assignment ${assign.title}`}
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(assign._id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    title="Delete assignment"
                    aria-label={`Delete assignment ${assign.title}`}
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ViewAssignment;