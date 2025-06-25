import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiEdit3, FiUpload } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfileAPI, updateUserProfileAPI } from "../services/userAPI";

// Validation schema
const ProfileSchema = Yup.object().shape({
  name: Yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  bio: Yup.string().max(200, "Bio can't exceed 200 characters"),
});

export default function ProfileManagement() {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
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
      queryClient.invalidateQueries(["userProfile"]);
      alert("Profile updated successfully!");
      console.log("Profile update response:", data);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  // Handle image change for profile picture
  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      // Optional: Validate file size (e.g., max 5MB) and type
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFieldValue("profilePic", file);
    }
  };

  // Initial form values
  const initialValues = {
    name: userProfile?.username || "",
    email: userProfile?.email || "",
    bio: userProfile?.profile?.bio || "",
    profilePic: null,
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 p-6">
      <motion.div
        className="max-w-lg mx-auto p-6 bg-white bg-opacity-90 backdrop-blur-lg rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-4 text-blue-700">Edit Profile</h2>

        {isFetching && <p className="text-center text-gray-500">Loading profile...</p>}
        {fetchError && (
          <p className="text-center text-red-500">{fetchError.message || "Failed to fetch profile"}</p>
        )}

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={ProfileSchema}
          onSubmit={(values, { setSubmitting, resetForm, setStatus }) => {
            // Create FormData object
            const formData = new FormData();
            formData.append("username", values.name);
            formData.append("email", values.email);
            // Send bio as part of profile object
            formData.append("profile", JSON.stringify({ bio: values.bio }));
            if (selectedFile) {
              formData.append("profileImage", selectedFile); // Match backend field name
            }

            updateProfileMutation.mutate(formData, {
              onSuccess: () => {
                resetForm();
                setPreview(null);
                setSelectedFile(null);
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
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
                    <FiUser size={40} className="text-gray-400" />
                  </div>
                )}

                <label className="cursor-pointer mt-3 inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <FiUpload size={16} />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setFieldValue)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Input Fields */}
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <Field
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
              </div>

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

              <div className="relative">
                <FiEdit3 className="absolute left-3 top-3 text-gray-400" />
                <Field
                  as="textarea"
                  name="bio"
                  placeholder="Short Bio"
                  className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <ErrorMessage name="bio" component="p" className="text-red-500 text-sm mt-1" />
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