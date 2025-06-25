import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'; // Import icons
import { useFormik } from "formik";
import * as Yup from "yup";
import { getQuizzesByModuleIdAPI, deleteQuizAPI, updateQuestionInQuizAPI } from "../services/quizAPI.js";

const ViewQuiz = () => {
  const { moduleId, courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const { data: quizQuestions, isLoading, isError, error } = useQuery({
    queryKey: ['view-quiz', moduleId],
    queryFn: () => getQuizzesByModuleIdAPI(moduleId),
    enabled: !!moduleId,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteQuizAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['view-quiz', moduleId]);
    },
    onError: (error) => {
      console.error("Error deleting quiz:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values) => updateQuestionInQuizAPI(editingQuestionId, {
      moduleId: moduleId, // ModuleId remains the same
      question: values.question,
      options: values.options,
      correctAnswer: values.correctAnswer,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['view-quiz', moduleId]);
      setEditingQuestionId(null);
      formik.resetForm();
    },
    onError: (error) => {
      formik.setStatus({ error: error.message || "Error updating quiz question" });
    },
  });

  const validationSchema = Yup.object({
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
  });

  const formik = useFormik({
    initialValues: {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      updateMutation.mutate(values);
    },
  });

  const handleEdit = (question) => {
    setEditingQuestionId(question._id);
    formik.setValues({
      question: question.question.questionText,
      options: question.question.options,
      correctAnswer: question.question.correctAnswer,
    });
    
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    formik.resetForm();
  };

  const handleDelete = (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      deleteMutation.mutate(questionId);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading quiz questions...</div>;
  if (isError) return <div className="text-center py-8 text-red-500">Error loading quiz questions: {error?.message || "Failed to load questions."}</div>;
  if (!quizQuestions || quizQuestions.length === 0) return (
    <div className="p-8 max-w-3xl my-10 mx-auto bg-white border-2 border-gray-300 text-gray-900 shadow-lg rounded-xl">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">Quiz Questions</h2>
      <h2 className="text-xl  mb-6 text-center text-gray-500">No Question found for this module!!</h2>
      <button
        onClick={() => navigate(`/professional/${courseId}/${moduleId}/create-quiz`)}
        className="mt-6 bg-green-500 text-white py-3 px-6 rounded-lg text-lg font-bold hover:bg-green-600 transition duration-300"
      >
        Add New Question
      </button>
    </div>
  );

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white border-2 border-gray-300 text-gray-900 shadow-lg rounded-xl">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">Quiz Questions</h2>
      <ul>
        {quizQuestions.map((questionItem) => (
          <li key={questionItem._id} className="mb-6 p-6 bg-gray-100 rounded-lg shadow-md relative">
            {editingQuestionId === questionItem._id ? (
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-lg font-medium text-gray-700">Question:</label>
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
                      <label className="block font-medium text-gray-700">Option {index + 1}:</label>
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
                      {formik.touched.options && formik.errors.options && formik.errors.options[index] && (
                        <p className="text-red-500 text-sm">{formik.errors.options[index]}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block font-medium text-gray-700">Correct Answer:</label>
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

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    onClick={handleCancelEdit}
                  >
                    <FaTimes className="inline-block mr-1" /> Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={updateMutation.isLoading}
                  >
                    <FaSave className="inline-block mr-1" /> {updateMutation.isLoading ? "Saving..." : "Save"}
                  </button>
                  {formik.status?.error && (
                    <p className="text-red-600 text-sm mt-2">{formik.status.error}</p>
                  )}
                </div>
              </form>
            ) : (
              <div className="flex justify-between items-start">
                <p className="font-semibold text-xl mb-2">{questionItem.question.questionText}</p>
                <div>
                  <button
                    onClick={() => handleEdit(questionItem)}
                    className="text-blue-500 hover:text-blue-700 mr-2 focus:outline-none"
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(questionItem._id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
            {editingQuestionId !== questionItem._id && (
              <ol className="list-decimal pl-5 mb-2">
                {questionItem.question.options.map((option, index) => (
                  <li key={index}>{option} {questionItem.question.correctAnswer === option}</li>
                ))}
              </ol>
            )}
            {editingQuestionId !== questionItem._id && (
              <p className="text-gray-600">
                Correct Answer: <span className="font-semibold">{questionItem.question.correctAnswer}</span>
              </p>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate(`/professional/${courseId}/${moduleId}/create-quiz`)}
        className="mt-6 bg-green-500 text-white py-3 px-6 rounded-lg text-lg font-bold hover:bg-green-600 transition duration-300"
      >
        Add New Question
      </button>
    </div>
  );
};

export default ViewQuiz;