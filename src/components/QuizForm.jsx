import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createQuizAPI } from "../services/quizAPI.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";


const QuizForm = () => {
  const navigate = useNavigate();
  const {courseId, moduleId } = useParams(); // ✅ Get moduleId from URL params

  const mutation = useMutation({
      mutationFn: createQuizAPI,
      onSuccess: () => {
          navigate(`/professional/${courseId}/${moduleId}/view-quiz`);
      },
      onError: (error) => {
          formik.setStatus({ error: error.message || "Error creating Quiz" });
      },
  });

  const formik = useFormik({
    initialValues: {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      moduleId
    },
    validationSchema: Yup.object({
      question: Yup.string().required("Question is required"),
      options: Yup.array()
        .of(Yup.string().required("Option cannot be empty"))
        .length(4, "Must have exactly 4 options"),
      correctAnswer: Yup.string()
        .required("Please enter the correct answer")
        .test(
          "is-valid-option",
          "Correct answer must match one of the options",
          function (value) {
            return this.parent.options.includes(value);
          }
        ),
    }),
    onSubmit: (values) => {
      mutation.mutate(values);
    }
  });

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl border">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
        Add a Quiz Question
      </h2>

      {mutation.isError && (
        <p className="text-center text-red-600">
          {mutation.error?.response?.data?.message || "Failed to create quiz"}
        </p>
      )}
      {mutation.isSuccess && (
        <p className="text-center text-green-600">Quiz created successfully!</p>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Question:
          </label>
          <textarea
            name="question"
            rows="3"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
            {...formik.getFieldProps("question")}
          />
          {formik.touched.question && formik.errors.question && (
            <p className="text-red-500 text-sm">{formik.errors.question}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formik.values.options.map((option, index) => (
            <div key={index}>
              <label className="block font-medium text-gray-700">
                Option {index + 1}:
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
                value={option}
                onChange={(e) => {
                  const newOptions = [...formik.values.options];
                  newOptions[index] = e.target.value;
                  formik.setFieldValue("options", newOptions);
                }}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            Correct Answer:
          </label>
          <select
            name="correctAnswer"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
            {...formik.getFieldProps("correctAnswer")}
          >
            <option value="">Select correct answer</option>
            {formik.values.options
              .filter(opt => opt.trim() !== "")
              .map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
          </select>
          {formik.touched.correctAnswer && formik.errors.correctAnswer && (
            <p className="text-red-500 text-sm">{formik.errors.correctAnswer}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Creating..." : "Create Quiz"}
        </button>
      </form>
    </div>
  );
};

export default QuizForm;