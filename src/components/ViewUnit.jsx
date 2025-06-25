import * as Yup from "yup";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useFormik } from "formik";
import { deleteUnitAPI, getUnitsByModuleIdAPI, updateUnitAPI } from "../services/unitAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ViewUnit = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editUnitId, setEditUnitId] = useState(null);
  const [files, setFiles] = useState([]);

  const { data: units, isError: error, isLoading: loading } = useQuery({
    queryKey: ["units", moduleId],
    queryFn: () => getUnitsByModuleIdAPI(moduleId),
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to fetch units");
    },
    select: (data) => data || [],
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ unitId, unitData }) => updateUnitAPI({ unitId, unitData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["units", moduleId]);
      toast.success("Unit updated successfully");
      setEditUnitId(null);
      setFiles([]);
      formik.resetForm();
    },
    onError: (err) => {
      formik.setStatus({ error: err?.response?.data?.message || "Failed to update unit" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUnitAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["units", moduleId]);
      toast.success("Unit deleted successfully");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete unit");
    },
  });

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string(),
    order: Yup.number().integer().min(0).label("Order"),
    content: Yup.string(),
    files: Yup.array().test(
      "fileSize",
      "File size too large (max 10MB per file)",
      (files) => !files || files.every((file) => file.size <= 10 * 1024 * 1024)
    ),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      order: 0,
      content: "",
      files: [],
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("order", values.order !== undefined ? values.order.toString() : "0");
      formData.append("content", values.content || "");
      values.files.forEach((file) => {
        formData.append("files", file);
      });
      updateMutation.mutate({ unitId: editUnitId, unitData: formData });
    },
  });

  const handleEditClick = (unit) => {
    setEditUnitId(unit._id);
    formik.setValues({
      title: unit.title,
      description: unit.description || "",
      order: unit.order || 0,
      content: unit.content?.value || "",
      files: [],
    });
    setFiles([]);
  };

  const handleEditCancel = () => {
    setEditUnitId(null);
    formik.resetForm();
    setFiles([]);
  };

  const handleDelete = (unitId) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      deleteMutation.mutate(unitId);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    formik.setFieldValue("files", selectedFiles);
    setFiles(selectedFiles);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-10">
        <h3 className="text-2xl font-bold mb-6">Units for Module</h3>
        <p>Loading units...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        Error loading units: {error?.response?.data?.message || "Failed to fetch units"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Units for Module</h3>
        <button
          onClick={() => navigate(`/professional/${courseId}/${moduleId}/create-unit`)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Create New Unit
        </button>
      </div>
      <ul className="space-y-4">
        {units?.map((unit) => (
          <li key={unit._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
            {editUnitId === unit._id ? (
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 rounded bg-gray-700 text-white border ${
                      formik.touched.title && formik.errors.title ? "border-red-500" : "border-gray-600"
                    }`}
                    required
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="text-red-500 text-sm">{formik.errors.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 rounded bg-gray-700 text-white border ${
                      formik.touched.description && formik.errors.description ? "border-red-500" : "border-gray-600"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formik.values.order}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 rounded bg-gray-700 text-white border ${
                      formik.touched.order && formik.errors.order ? "border-red-500" : "border-gray-600"
                    }`}
                  />
                  {formik.touched.order && formik.errors.order && (
                    <p className="text-red-500 text-sm">{formik.errors.order}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Content</label>
                  <textarea
                    name="content"
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 rounded bg-gray-700 text-white border ${
                      formik.touched.content && formik.errors.content ? "border-red-500" : "border-gray-600"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Upload New File (Image or Video)</label>
                  <input
                    type="file"
                    name="files"
                    onChange={handleFileChange}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    accept="image/*,video/*"
                  />
                  {formik.touched.files && formik.errors.files && (
                    <p className="text-red-500 text-sm">{formik.errors.files}</p>
                  )}
                  {files.length > 0 && (
                    <div className="mt-2">
                      <p className="text-gray-400">Selected Files:</p>
                      <ul>
                        {files.map((file, index) => (
                          <li key={index} className="text-gray-400">{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                {formik.status?.error && (
                  <p className="text-red-500 text-sm">{formik.status.error}</p>
                )}
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">
                    <strong>Title:</strong> {unit.title}
                  </p>
                  {unit.description && (
                    <p className="text-sm">
                      <strong>Description:</strong> {unit.description}
                    </p>
                  )}
                  <p className="text-sm">
                    <strong>Order:</strong> {unit.order || 0}
                  </p>
                  {unit.content && (
                    <p className="text-sm">
                      <strong>Content:</strong>
                      {unit.content.type === "text" && unit.content.value}
                      {unit.content.type === "image" && (
                        <img
                          src={unit.content.value}
                          alt="Unit Image"
                          className="max-w-[300px] max-h-[200px] object-contain mt-2"
                        />
                      )}
                      {unit.content.type === "video" && (
                        <video
                          src={unit.content.value}
                          controls
                          className="max-w-[300px] max-h-[200px] object-contain mt-2"
                        />
                      )}
                    </p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEditClick(unit)}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    title="Edit unit"
                    aria-label={`Edit unit ${unit.title}`}
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(unit._id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    title="Delete unit"
                    aria-label={`Delete unit ${unit.title}`}
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

export default ViewUnit;