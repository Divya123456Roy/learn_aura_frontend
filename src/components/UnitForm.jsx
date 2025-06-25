// frontend/src/components/CreateUnit.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createUnitAPI } from "../services/unitAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateUnit = () => {
  const { moduleId,courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState([]);

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
  

  const createMutation = useMutation({
    mutationFn: (unitData) => createUnitAPI(unitData),
    onSuccess: () => {
      queryClient.invalidateQueries(["units", moduleId]);
      toast.success("Unit created successfully");
      navigate(`/professional/${courseId}/${moduleId}/view-unit`); // Redirect back to view units
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create unit");
    },
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
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("order", values.order !== undefined ? values.order.toString() : "0");
      formData.append("content", values.content || "");
      values.files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("moduleId", moduleId); // Ensure moduleId is sent

      createMutation.mutate(formData);
    },
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    formik.setFieldValue("files", selectedFiles);
    setFiles(selectedFiles);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h3 className="text-2xl font-bold mb-6">Create New Unit</h3>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
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
          <label htmlFor="description" className="block text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
        </div>

        <div>
          <label htmlFor="order" className="block text-gray-300 mb-1">
            Order (Optional)
          </label>
          <input
            type="number"
            id="order"
            name="order"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.order}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
          {formik.touched.order && formik.errors.order && (
            <p className="text-red-500 text-sm">{formik.errors.order}</p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-gray-300 mb-1">
            Text Content (Optional)
          </label>
          <textarea
            id="content"
            name="content"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.content}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="files" className="block text-gray-300 mb-1">
            Upload Files (Images or Videos, Max 10MB per file)
          </label>
          <input
            type="file"
            id="files"
            name="files"
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            multiple
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
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={createMutation.isLoading}
          >
            {createMutation.isLoading ? "Creating..." : "Create Unit"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/professional/${moduleId}/view-units`)}
            className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
        {formik.status?.error && (
          <p className="text-red-500 text-sm">{formik.status.error}</p>
        )}
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateUnit;