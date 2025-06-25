import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaUser, FaLock } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginUserAction } from "../redux/Userslice";
import { loginAPI } from "../services/userServices";
import { useNavigate } from "react-router-dom";
import aboutBg from "../assets/image/login.webp"; // Importing the image

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: loginAPI,
    mutationKey: ["Login"],
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${aboutBg})` }}>
      <div className="bg-white p-10 rounded-xl shadow-lg w-96 bg-opacity-90">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              const data = await mutateAsync(values);
              console.log("Login Success:", data);
              dispatch(loginUserAction(data)); // FIXED THIS LINE
              sessionStorage.setItem("userToken", data.token);
              navigate('/admin/admin-dashboard');
              resetForm();
            } catch (err) {
              console.error("Login Error:", err.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div className="relative">
                <label className="block text-gray-700 font-medium">Email</label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-3 text-gray-500 text-lg" />
                  <Field type="email" name="email" className="w-full pl-10 pr-4 py-3 mt-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" placeholder="Enter your email" />
                </div>
                <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="relative">
                <label className="block text-gray-700 font-medium">Password</label>
                <div className="relative flex items-center">
                  <FaLock className="absolute left-3 text-gray-500 text-lg" />
                  <Field type="password" name="password" className="w-full pl-10 pr-4 py-3 mt-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" placeholder="Enter your password" />
                </div>
                <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
                <div className="text-right mt-2">
                  <a href="/forgot-password" className="text-pink-500 hover:underline text-sm">Forgot Password?</a>
                </div>
              </div>

              <button type="submit" className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-pink-600 transition duration-300 shadow-md" disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? "Logging in..." : "Login"}
              </button>
              {error && <p className="text-red-500 text-center mt-3">{error.message}</p>}
            </Form>
          )}
        </Formik>

        <p className="text-center text-gray-700 mt-6">
          Don't have an account? 
          <a href="/signup" className="text-pink-500 hover:underline font-medium"> Sign up</a>
        </p>
      </div>
    </div>
  );
}
