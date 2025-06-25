import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createAssignmentAPI } from "../services/assignmentAPI";

const CreateAssignment = () => {
    const navigate = useNavigate();
    const {courseId, moduleId } = useParams(); // ✅ Get moduleId from URL params

    const mutation = useMutation({
        mutationFn: createAssignmentAPI,
        onSuccess: () => {
            navigate(`/professional/${courseId}/${moduleId}/assignment/view-assignment`);
        },
        onError: (error) => {
            formik.setStatus({ error: error.message || "Error creating assignment" });
        },
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            courseId,
            moduleId
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required"),
            description: Yup.string().required("Description is required"),
            // dueDate: Yup.date().required("Due date is required").nullable(),
            // moduleId: Yup.string().required("Module ID is required"),
        }),
        onSubmit: (values) => {
            console.log("Form values submitted:", values); // 🔍 Debug
            mutation.mutate(values);
        },
    });

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Create Assignment</h1>

                {formik.status?.error && (
                    <p className="text-red-500 mb-4">{formik.status.error}</p>
                )}
                {mutation.isLoading && <p className="text-blue-500 mb-4">Creating assignment...</p>}

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    {/* Title */}
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

                    {/* Description */}
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

                    {/* Due Date
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formik.values.dueDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`mt-1 block w-full p-2 border rounded-md ${
                                formik.touched.dueDate && formik.errors.dueDate
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {formik.touched.dueDate && formik.errors.dueDate && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.dueDate}</p>
                        )}
                    </div> */}

                    {/* Hidden Module ID Field */}
                    <input type="hidden" name="moduleId" value={formik.values.moduleId} />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={mutation.isLoading || !formik.isValid}
                        className={`w-full p-2 rounded-md text-white transition ${
                            mutation.isLoading || !formik.isValid
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {mutation.isLoading ? "Creating..." : "Create Assignment"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAssignment;