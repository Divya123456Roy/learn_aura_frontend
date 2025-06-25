import { useNavigate } from "react-router-dom"; // Import useNavigate
import bgImg from "../assets/image/1.jpg";

export default function Banner() {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <section
      id="home"
      className="relative bg-cover bg-center h-screen flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-opacity-50"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl text-left text-white">
          <h1 className="text-5xl font-bold leading-tight">
            Learn Smarter, Collaborate Better!
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            "LearnAura empowers students and professionals by providing a structured and engaging environment for collaborative learning, study group formation, and seamless knowledge sharing."
          </p>

          {/* Key Features Section */}
          <div className="mt-6 space-y-3">
            <p className="flex items-center">
              ✅ Join & Create <strong className="ml-1">Study Groups</strong>
            </p>
            <p className="flex items-center">
              🏆 Track Progress with <strong className="ml-1">Badges & Leaderboards</strong>
            </p>
            <p className="flex items-center">
              📊 Analyze Learning with <strong className="ml-1">Performance Dashboards</strong>
            </p>
            <p className="flex items-center">
              🎯 Engage in Real-time <strong className="ml-1">Discussions & Collaborations</strong>
            </p>
          </div>

          {/* Subscription & Actions */}
          <div className="mt-6 flex flex-col md:flex-row items-center">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="p-3 text-gray-900 rounded-lg w-full md:w-80 focus:ring focus:ring-blue-500"
            />
            
            <button
              onClick={() => navigate("/signup")}
              className="bg-green-500 text-white px-6 py-3 rounded-lg mt-4 md:mt-0 md:ml-4 hover:bg-green-600 transition"
            >
              Join Now  
            </button>
            {/* <button
              onClick={() => navigate("/professional/mentorlog")}
              className="bg-green-500 text-white px-6 py-3 rounded-lg mt-4 md:mt-0 md:ml-4 hover:bg-green-600 transition"
            >
              Mentor Log
            </button> */}
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-sm text-gray-300">
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer text-blue-400 hover:underline"
            >
              Already have an account? Log in
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
