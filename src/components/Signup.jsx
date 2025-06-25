import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { loginUserAction } from "../redux/Userslice";
import { registerAPI } from  "../services/userServices"

function Signup() {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      gender: "",
      role: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      gender: Yup.string().required("Gender is required"),
      role: Yup.string().required("Role is required"),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {

      try {
        const {token} = await registerAPI(values); // Call the register API with form values

        sessionStorage.setItem("userToken", token); // Store the token in local storage
        const decodedData = jwtDecode(token); // Decode the JWT token to get user data
        dispatch(loginUserAction(decodedData)); // Dispatch the login action to update the Redux store
        setStatus("Signup successful! Welcome aboard.");
      } catch (error) {
        console.error("Signup failed:", error);
        setStatus("Signup failed. Please try again.");
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
      <form onSubmit={formik.handleSubmit} className="bg-white p-10 rounded-lg shadow-2xl w-96 text-gray-900">
        <h2 className="text-4xl font-bold text-center mb-6">Join the Learning Community</h2>
        {formik.status && <p className="text-red-500 mb-4 text-center">{formik.status}</p>}

        <input
          className="border border-gray-300 p-3 w-full mb-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
          type="text"
          name="username"
          placeholder="Full Name"
          {...formik.getFieldProps("username")}
        />
        {formik.touched.username && formik.errors.username && (
          <p className="text-red-500 text-sm mb-2">{formik.errors.username}</p>
        )}

        <input
          className="border border-gray-300 p-3 w-full mb-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
          type="email"
          name="email"
          placeholder="Email"
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm mb-2">{formik.errors.email}</p>
        )}

        <input
          className="border border-gray-300 p-3 w-full mb-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
          type="password"
          name="password"
          placeholder="Password"
          {...formik.getFieldProps("password")}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-sm mb-2">{formik.errors.password}</p>
        )}

        <select
          className="border border-gray-300 p-3 w-full mb-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
          name="gender"
          {...formik.getFieldProps("gender")}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {formik.touched.gender && formik.errors.gender && (
          <p className="text-red-500 text-sm mb-2">{formik.errors.gender}</p>
        )}

        <select
          className="border border-gray-300 p-3 w-full mb-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
          name="role"
          {...formik.getFieldProps("role")}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
          <option value="student">Student</option>
        </select>
        {formik.touched.role && formik.errors.role && (
          <p className="text-red-500 text-sm mb-2">{formik.errors.role}</p>
        )}

        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 w-full rounded-lg text-lg font-bold hover:opacity-90 transition duration-300"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
        <p className="mt-4 text-center text-gray-700">
          Already have an account? <a href="/login" className="text-indigo-600 font-bold hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
