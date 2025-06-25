import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchCourseByIdAPI,
  updateCourseAPI,
  deleteCourseAPI,
} from "../services/courseAPI"; // Adjust the path

const CourseDetails = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit mode
  const [errorMessage, setErrorMessage] = useState(""); // For delete error

  // Fetch the course details using useQuery
  const { data: course, error, isLoading, refetch } = useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourseByIdAPI(id),
  });
console.log(course);

  // Define the mutation for updating a course
  const updateMutation = useMutation({
    mutationFn: updateCourseAPI,
    onSuccess: () => {
      setIsEditing(false); // Exit edit mode
      refetch(); // Refetch course data to show updates
      formik.resetForm(); // Reset form state
    },
    onError: (error) => {
      formik.setStatus({ error: error.message || "Error updating course" });
    },
  });

  // Define the mutation for deleting a course
  const deleteMutation = useMutation({
    mutationFn: deleteCourseAPI,
    onSuccess: () => {
      navigate("/professional"); // Redirect to MentorDashboard
    },
    onError: (error) => {
      setErrorMessage(error.message || "Error deleting course");
    },
  });

  // Set up Formik for form handling and validation
  const formik = useFormik({
    initialValues: {
      title: course?.title || "",
      description: course?.description || "",
      price: course?.price || "",
      category: course?.category || "",
      tags: course?.tags?.join(", ") || "", // Initialize tags as comma-separated string
      whatYoullLearn: course?.whatYoullLearn?.join(", ") || "", // Initialize whatYoullLearn as comma-separated string
      highlights: course?.highlights?.join(", ") || "", // Initialize highlights as comma-separated string
    },
    enableReinitialize: true, // Reinitialize form when course data changes
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.number()
        .required("Price is required")
        .min(0, "Price must be a positive number"),
      category: Yup.string().required("Category is required"),
      tags: Yup.string(), // Tags are optional
      whatYoullLearn: Yup.string(), // whatYoullLearn is optional
      highlights: Yup.string(), // highlights is optional
    }),
    onSubmit: (values) => {
      const courseData = {
        courseId: id,
        courseData: {
          ...values,
          tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()) : [], // Split and trim tags
          whatYoullLearn: values.whatYoullLearn
            ? values.whatYoullLearn.split(",").map((item) => item.trim())
            : [], // Split and trim whatYoullLearn
          highlights: values.highlights
            ? values.highlights.split(",").map((item) => item.trim())
            : [], // Split and trim highlights
        },
      };
      updateMutation.mutate(courseData);
    },
  });

  // Handle delete action with confirmation
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center p-6">Loading course details...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        {error.message || "Failed to fetch course"}
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Course Details
      </h1>

      <div className="max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-lg">
        {/* Display error from delete mutation */}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        {/* Display error from update mutation */}
        {formik.status?.error && (
          <p className="text-red-500 mb-4">{formik.status.error}</p>
        )}

        {/* Display loading state for mutations */}
        {(updateMutation.isLoading || deleteMutation.isLoading) && (
          <p className="text-blue-500 mb-4">
            {updateMutation.isLoading ? "Updating course..." : "Deleting course..."}
          </p>
        )}

        {!isEditing ? (
          // View Mode
          <div>
            <h2 className="text-2xl font-semibold mb-4">{course?.course?.title}</h2>
            <p className="text-gray-600 mb-2">
              <strong>Description:</strong> {course?.course?.description}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Category:</strong> {course?.course?.category}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Price:</strong> ${course?.course?.price}
            </p>
            {course.course.tags && course.course.tags.length > 0 && (
              <p className="text-gray-600 mb-2">
                <strong>Tags:</strong> {course?.course?.tags.join(", ")}
              </p>
            )}
            {course.course.whatYoullLearn && course.course.whatYoullLearn.length > 0 && (
              <p className="text-gray-600 mb-2">
                <strong>What You'll Learn:</strong> {course?.course?.whatYoullLearn.join(", ")}
              </p>
            )}
            {course.course.highlights && course.course.highlights.length > 0 && (
              <p className="text-gray-600 mb-2">
                <strong>Highlights:</strong> {course?.course?.highlights.join(", ")}
              </p>
            )}
            <p className="text-gray-600 mb-4">
              <strong>Instructor:</strong> {course?.course?.instructorId?.username || "Unknown"}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Edit Course
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isLoading}
                className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg ${
                  deleteMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Delete Course
              </button>
            </div>
          </div>
        ) : (
          // Edit Mode
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
                  formik.touched.title && formik.errors.title ? "border-red-500" : "border-gray-300"
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
                  formik.touched.description && formik.errors.description ? "border-red-500" : "border-gray-300"
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
                  formik.touched.price && formik.errors.price ? "border-red-500" : "border-gray-300"
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
                  formik.touched.category && formik.errors.category ? "border-red-500" : "border-gray-300"
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
                  formik.touched.tags && formik.errors.tags ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formik.touched.tags && formik.errors.tags && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.tags}</p>
              )}
            </div>

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
                  formik.touched.highlights && formik.errors.highlights ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formik.touched.highlights && formik.errors.highlights && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.highlights}</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={updateMutation.isLoading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg ${
                  updateMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {updateMutation.isLoading ? "Updating..." : "Update Course"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;