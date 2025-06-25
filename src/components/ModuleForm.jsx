import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createModuleAPI } from "../services/moduleAPI"; // Adjust path
import { fetchAllCoursesAPI } from "../services/courseAPI"; // Adjust path

const ModuleForm = () => {
  const { state } = useLocation();
  const preselectedCourseId = state?.courseId;
  const navigate = useNavigate();
  const { courseId } = useParams(); // courseId from route

  // Fetch only the relevant course (if needed)
  const {
    data: courses,
    error: coursesError,
    isLoading: coursesLoading,
  } = useQuery({
    queryKey: ["courses", courseId],
    queryFn: () => fetchAllCoursesAPI(courseId),
  });

  // Create module mutation
  const mutation = useMutation({
    mutationFn: createModuleAPI,
    onSuccess: () => {
      navigate(`/professional/${courseId}/module`);
    },
    onError: (error) => {
      formik.setStatus({ error: error.message || "Error creating module" });
    },
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      courseId: preselectedCourseId || courseId || "", // ensure courseId is set
      order: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string(),
      courseId: Yup.string().required("Course is required"),
      order: Yup.number()
        .typeError("Order must be a number")
        .min(0, "Order must be a positive number"),
    }),
    onSubmit: (values) => {
      console.log("Submitting values:", values); // Debug
      mutation.mutate({ ...values, order: values.order || 0 });
    },
  });

  return (
    <div className="max-w-lg mx-auto p-5 mt-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Create a Module</h2>

      {/* Course Loading/Error Messages */}
      {coursesLoading && <p className="text-blue-500 mb-4">Loading courses...</p>}
      {coursesError && <p className="text-red-500 mb-4">Failed to fetch courses</p>}
      {formik.status?.error && <p className="text-red-500 mb-4">{formik.status.error}</p>}
      {mutation.isLoading && <p className="text-blue-500 mb-4">Creating module...</p>}

      <form onSubmit={formik.handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <input
            type="text"
            name="title"
            placeholder="Module Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded ${
              formik.touched.title && formik.errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-3">
          <textarea
            name="description"
            placeholder="Module Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded ${
              formik.touched.description && formik.errors.description
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
          )}
        </div>

        {/* Order */}
        <div className="mb-3">
          <input
            type="number"
            name="order"
            placeholder="Module Order"
            value={formik.values.order}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded ${
              formik.touched.order && formik.errors.order ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formik.touched.order && formik.errors.order && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.order}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutation.isLoading}
          className={`w-full p-2 rounded-lg text-white ${
            mutation.isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {mutation.isLoading ? "Submitting..." : "Submit Module"}
        </button>
      </form>
    </div>
  );
};

export default ModuleForm;
