import { useFormik } from "formik";
import * as Yup from "yup";

export default function ForgotPassword() {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
    }),
    onSubmit: (values) => {
      console.log("Password reset request", values);
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="bg-white p-10 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Enter your email address to reset your password.
        </p>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="relative">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 mt-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-pink-600 transition duration-300 shadow-md"
          >
            Reset Password
          </button>
        </form>
        <p className="text-center text-gray-700 mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-pink-500 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
