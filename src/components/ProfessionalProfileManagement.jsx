import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiEdit3, FiUpload, FiPhone, FiBook, FiTarget, FiCode } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfileAPI, updateUserProfileAPI } from "../services/userAPI";

// Validation schema
const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().min(2, "First name must be at least 2 characters").required("First name is required"),
  lastName: Yup.string().min(2, "Last name must be at least 2 characters").required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  contactNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Contact number must be exactly 10 digits")
    .required("Contact number is required"),
  bio: Yup.string().max(200, "Bio can't exceed 200 characters"),
  qualifications: Yup.string().max(100, "Qualifications can't exceed 100 characters"),
  learningInterests: Yup.string(),
  academicBackground: Yup.string().max(100, "Academic background can't exceed 100 characters"),
  professionalGoals: Yup.string().max(200, "Professional goals can't exceed 200 characters"),
  skillsets: Yup.string(),
  learningPreferences: Yup.string(),
});

export default function ProfessionalProfileManagement() {
  const [preview, setPreview] = useState(null);
  const queryClient = useQueryClient();

  // Fetch user profile using useQuery
  const { data: userProfile, error: fetchError, isLoading: isFetching } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfileAPI,
    onError: (error) => {
      console.error("Error fetching user profile:", error);
    },
  });

  // Update user profile using useMutation
  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfileAPI,
    onSuccess: (data) => {
      alert("Profile updated successfully!");
      console.log("Profile update response:", data);
      queryClient.setQueryData(["userProfile"], data);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  // Handle image change for profile picture
  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("Image size must be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFieldValue("profileImage", file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Initial form values (prefilled with fetched data if available)
  const initialValues = {
    firstName: userProfile?.profile?.firstName || "",
    lastName: userProfile?.profile?.lastName || "",
    email: userProfile?.email || "",
    contactNumber: userProfile?.profile?.contactNumber || "",
    bio: userProfile?.profile?.bio || "",
    qualifications: userProfile?.profile?.qualifications || "",
    learningInterests: userProfile?.profile?.learningInterests?.map(item => item.replace(/"/g, '')).join(", ") || "",
    academicBackground: userProfile?.profile?.academicBackground?.replace(/"/g, '') || "",
    professionalGoals: userProfile?.profile?.professionalGoals || "",
    skillsets: userProfile?.profile?.skillsets?.join(", ") || "",
    learningPreferences: userProfile?.profile?.learningPreferences?.map(item => item.replace(/"/g, '')).join(", ") || "",
    profileImage: null,
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 p-6">
      <motion.div
        className="max-w-2xl mx-auto p-6 bg-white bg-opacity-90 backdrop-blur-lg rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-4 text-blue-700">Professional Profile Management</h2>

        {isFetching && <p className="text-center text-gray-500">Loading profile...</p>}
        {fetchError && (
          <p className="text-center text-red-500">{fetchError.message || "Failed to fetch profile"}</p>
        )}

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={ProfileSchema}
          onSubmit={(values, { setSubmitting, resetForm, setStatus }) => {
            const formData = new FormData();
            formData.append("username", `${values.firstName} ${values.lastName}`);
            formData.append("email", values.email);
            formData.append(
              "profile",
              JSON.stringify({
                firstName: values.firstName,
                lastName: values.lastName,
                contactNumber: values.contactNumber,
                bio: values.bio,
                qualifications: values.qualifications,
                learningInterests: values.learningInterests
                  ? values.learningInterests.split(",").map((item) => item.trim())
                  : [],
                academicBackground: values.academicBackground,
                professionalGoals: values.professionalGoals,
                skillsets: values.skillsets ? values.skillsets.split(",").map((item) => item.trim()) : [],
                learningPreferences: values.learningPreferences
                  ? values.learningPreferences.split(",").map((item) => item.trim())
                  : [],
              })
            );

            if (values.profileImage) {
              formData.append("profileImage", values.profileImage);
            }

            updateProfileMutation.mutate(formData, {
              onSuccess: () => {
                resetForm();
                setPreview(null);
                setSubmitting(false);
              },
              onError: (error) => {
                setStatus({ error: error.message || "Failed to update profile" });
                setSubmitting(false);
              },
            });
          }}
        >
          {({ setFieldValue, isSubmitting, status }) => (
            <Form className="space-y-4">
              {/* Profile Picture Upload */}
              <div className="text-center">
                {preview || userProfile?.profile?.profilePicture ? (
                  <motion.img
                    src={preview || userProfile?.profile?.profilePicture}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    onError={(e) => (e.target.src = "/default-profile.png")} // Fallback image
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
                    <FiUser size={40} className="text-gray-400" />
                  </div>
                )}

                <label className="cursor-pointer mt-3 inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <FiUpload size={16} />
                  <span>Upload Profile Picture</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setFieldValue)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* First Name */}
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <Field
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <ErrorMessage name="firstName" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Last Name */}
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <Field
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <ErrorMessage name="lastName" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Email */}
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <Field
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Contact Number */}
              <div className="relative">
                <FiPhone className="absolute left-3 top-3 text-gray-400" />
                <Field
                  type="text"
                  name="contactNumber"
                  placeholder="Contact Number (10 digits)"
                  className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <ErrorMessage name="contactNumber" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Bio */}
              <div className="relative">
                <FiEdit3 className="absolute left-3 top-3 text-gray-400" />
                <Field
                  as="textarea"
                  name="bio"
                  placeholder="Short Bio (max 200 characters)"
                  className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <ErrorMessage name="bio" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Qualifications */}
              <div className="relative">
                <FiBook className="absolute left-3 top-3 text-gray-400" />
                <Field
                  type="text"
                  name="qualifications"
                  placeholder="Qualifications (e.g., B.Sc. Computer Science)"
                  className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <ErrorMessage name="qualifications" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Learning Interests */}
              <div className="relative">
                <FiBook className="absolute left-3 top-3 text-gray-400" />
                <Field
                  type="text"
                  name="learningInterests"


                  placeholder="Learning Interests (comma-separated, e.g., AI, Data Science)"
                  className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <ErrorMessage name="learningInterests" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Academic Background */}
              <div className="relative">
                <FiBook className="absolute left-3 top-3 text-gray-400" />
                <Field
                  type="text"
                  name="academicBackground"
                  placeholder="Academic Background (e.g., Computer Science)"
                  className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <ErrorMessage name="academicBackground" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Professional Goals */}
              <div className="relative">
                <FiTarget className="absolute left-3 top-3 text-gray-400" />
                <Field
                  as="textarea"
                  name="professionalGoals"
                  placeholder="Professional Goals (max 200 characters)"
                  className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <ErrorMessage name="professionalGoals" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Skillsets */}
              <div className="relative">
                <FiCode className="absolute left-3 top-3 text-gray-400" />
                <Field
                  type="text"
                  name="skillsets"
                  placeholder="Skillsets (comma-separated, e.g., JavaScript, Python)"
                  className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <ErrorMessage name="skillsets" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Learning Preferences */}
              <div className="relative">
                <FiBook className="absolute left-3 top-3 text-gray-400" />
                <Field
                  type="text"
                  name="learningPreferences"
                  placeholder="Learning Preferences (comma-separated, e.g., Visual, Hands-on)"
                  className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <ErrorMessage name="learningPreferences" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Save Button */}
              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting || updateProfileMutation.isLoading}
              >
                <FiEdit3 />
                <span>{isSubmitting || updateProfileMutation.isLoading ? "Saving..." : "Save Changes"}</span>
              </motion.button>

              {/* Display error message if update fails */}
              {status?.error && (
                <p className="text-red-500 text-center mt-2">{status.error}</p>
              )}
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
}