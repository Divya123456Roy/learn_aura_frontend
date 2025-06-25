import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchModulesByCourseIdAPI,
  updateModuleAPI,
  deleteModuleAPI,
} from "../services/moduleAPI";
import { fetchCourseByIdAPI } from "../services/courseAPI";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon as ViewIcon,
  BookOpenIcon as UnitIcon,
  QuestionMarkCircleIcon as QuizIcon,
} from "@heroicons/react/24/outline";

const ModuleList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [editingModuleId, setEditingModuleId] = useState(null);

  const { data: courseDetails, error: courseError, isLoading: courseLoading } = useQuery({
    queryKey: ["courseDetails", courseId],
    queryFn: () => fetchCourseByIdAPI(courseId),
    enabled: !!courseId,
  });

  const { data: modules, error, isLoading, refetch } = useQuery({
    queryKey: ["modules", courseId],
    queryFn: () => fetchModulesByCourseIdAPI(courseId),
    enabled: !!courseId,
  });

  const updateMutation = useMutation({
    mutationFn: updateModuleAPI,
    onSuccess: () => {
      setEditingModuleId(null);
      refetch();
    },
    onError: (error) => {
      formik.setStatus({ error: error.message || "Error updating module" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteModuleAPI,
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      setErrorMessage(error.message || "Error deleting module");
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      order: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string(),
      order: Yup.number().min(0, "Order must be a positive number"),
    }),
    onSubmit: (values) => {
      const moduleData = {
        moduleId: editingModuleId,
        moduleData: values,
      };
      updateMutation.mutate(moduleData);
    },
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleEdit = (module) => {
    setEditingModuleId(module._id);
    formik.setValues({
      title: module.title,
      description: module.description || "",
      order: module.order || "",
    });
  };

  const handleDelete = (moduleId) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      deleteMutation.mutate(moduleId);
    }
  };

  if (courseLoading) {
    return <div className="text-center p-6">Loading course information...</div>;
  }

  if (courseError) {
    return (
      <div className="text-center p-6 text-red-500">
        {courseError.message || "Failed to fetch course information"}
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center p-6">Loading modules...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        {error.message || "Failed to fetch modules"}
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Enhanced Course Header */}
      {courseDetails && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-5">
           
            
            <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">{courseDetails.course.title}</h2>
            <p className="text-gray-600 text-center mb-1">
              <span className="font-semibold">Category:</span> {courseDetails.course.category}
            </p>
            
            {courseDetails.tags && courseDetails.tags.length > 0 && (
              <div className="flex flex-wrap justify-center mt-2">
                <span className="font-semibold text-gray-600 mr-2">Tags:</span>
                {courseDetails.course.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-700 mr-2 mb-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Course Modules</h1>
        <Link
          to={`/professional/${courseId}/create-module`}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <span className="flex items-center">
            <ViewIcon className="h-5 w-5 mr-2" />
            Create New Module
          </span>
        </Link>
      </div>

      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

      {modules && modules.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          No modules found for this course.
        </div>
      ) : (
        <div className="grid gap-6 max-w-4xl mx-auto">
          {modules?.map((module) => (
            <div key={module._id} className="bg-white rounded-lg shadow-md p-6">
              {editingModuleId === module._id ? (
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        formik.touched.title && formik.errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formik.touched.title && formik.errors.title && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      rows={3}
                      className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        formik.touched.description && formik.errors.description ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formik.touched.description && formik.errors.description && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                      Order
                    </label>
                    <input
                      type="number"
                      id="order"
                      name="order"
                      value={formik.values.order}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        formik.touched.order && formik.errors.order ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formik.touched.order && formik.errors.order && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.order}</p>
                    )}
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingModuleId(null)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateMutation.isLoading}
                      className={`bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        updateMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {updateMutation.isLoading ? "Updating..." : "Save"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{module.title}</h3>
                    <p className="text-gray-500 text-sm">{module.description || "No description provided."}</p>
                    <p className="text-gray-500 text-sm">Order: {module.order || 0}</p>
                    <p className="text-gray-500 text-sm">
                      Course: {module.courseId?.title || "Unknown"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(module)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Edit module ${module.title}`}
                      title="Edit Module"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(module._id)}
                      disabled={deleteMutation.isLoading}
                      className={`bg-red-500 hover:bg-red-600 text-white p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                        deleteMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      aria-label={`Delete module ${module.title}`}
                      title="Delete Module"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <Link
                      to={{
                        pathname: `/professional/${courseId}/${module._id}/assignment/view-assignment`,
                        state: { moduleId: module._id },
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      aria-label={`View assignment for module ${module.title}`}
                      title="View Assignment"
                    >
                      <ViewIcon className="h-5 w-5" />  
                    </Link>
                    <Link
                      to={{
                        pathname: `/professional/${courseId}/${module._id}/view-unit`,
                        state: { moduleId: module._id },
                      }}
                      className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                      aria-label={`View unit for module ${module.title}`}
                      title="View Unit"
                    >
                      <UnitIcon className="h-5 w-5" />
                    </Link>
                    <Link
                      to={{
                        pathname: `/professional/${courseId}/${module._id}/view-quiz`,
                        state: { moduleId: module._id },
                      }}
                      className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      aria-label={`View quiz for module ${module.title}`}
                      title="View Quiz"
                    >
                      <QuizIcon className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleList;