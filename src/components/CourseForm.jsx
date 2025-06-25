import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createCourseAPI } from "../services/courseAPI";

const CourseForm = ({ user }) => {
  const navigate = useNavigate();

  // Define the mutation for creating a course
  const mutation = useMutation({
    mutationFn: createCourseAPI,
    onSuccess: () => {
      navigate("/professional");
    },
    onError: (error) => {
      formik.setStatus({ error: error.message || "Error creating course" });
    },
  });

  // Set up Formik for form handling and validation
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      tags: "",
      whatYoullLearn: "", // New field for whatYoullLearn
      highlights: "", // New field for highlights
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.number()
        .required("Price is required")
        .min(0, "Price must be a positive number"),
      category: Yup.string().required("Category is required"),
      tags: Yup.string(),
      whatYoullLearn: Yup.string(), // Optional, but can be validated if needed
      highlights: Yup.string(), // Optional, but can be validated if needed
    }),
    onSubmit: (values) => {
      const courseData = {
        ...values,
        tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()) : [], // Split and trim tags
        whatYoullLearn: values.whatYoullLearn
          ? values.whatYoullLearn.split(",").map((item) => item.trim())
          : [], // Split and trim whatYoullLearn
        highlights: values.highlights
          ? values.highlights.split(",").map((item) => item.trim())
          : [], // Split and trim highlights
      };
      mutation.mutate(courseData);
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 mt-3 mb-3 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Create Course</h1>

        {/* Display error from mutation */}
        {formik.status?.error && (
          <p className="text-red-500 mb-4">{formik.status.error}</p>
        )}

        {/* Display loading state */}
        {mutation.isLoading && <p className="text-blue-500 mb-4">Creating course...</p>}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`mt-1 block w-full p-2 border rounded-md ${
                formik.touched.title && formik.errors.title
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`mt-1 block w-full p-2 border rounded-md ${
                formik.touched.description && formik.errors.description
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`mt-1 block w-full p-2 border rounded-md ${
                formik.touched.price && formik.errors.price
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.price && formik.errors.price && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`mt-1 block w-full p-2 border rounded-md ${
                formik.touched.category && formik.errors.category
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.category && formik.errors.category && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags (separated by commas)
            </label>
            <input
              type="text"
              name="tags"
              value={formik.values.tags}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`mt-1 block w-full p-2 border rounded-md ${
                formik.touched.tags && formik.errors.tags
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.tags && formik.errors.tags && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.tags}</p>
            )}
          </div>

          {/* New whatYoullLearn Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              What You'll Learn (separated by commas)
            </label>
            <input
              type="text"
              name="whatYoullLearn"
              value={formik.values.whatYoullLearn}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`mt-1 block w-full p-2 border rounded-md ${
                formik.touched.whatYoullLearn && formik.errors.whatYoullLearn
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.whatYoullLearn && formik.errors.whatYoullLearn && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.whatYoullLearn}</p>
            )}
          </div>

          {/* New Highlights Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Highlights (separated by commas)
            </label>
            <input
              type="text"
              name="highlights"
              value={formik.values.highlights}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`mt-1 block w-full p-2 border rounded-md ${
                formik.touched.highlights && formik.errors.highlights
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.highlights && formik.errors.highlights && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.highlights}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isLoading}
            className={`w-full p-2 rounded-md text-white ${
              mutation.isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {mutation.isLoading ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;