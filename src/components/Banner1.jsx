import { useNavigate } from "react-router-dom"; // Import useNavigate
import bgImg from "../assets/image/studenthome.webp";

export default function Banner1() {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <section
      id="home"
      className="w-full relative bg-cover bg-center h-screen flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-opacity-50"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="w-full max-w-2xl text-left text-white">
          <h1 className="w-full text-5xl font-bold leading-tight">
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

        
        </div>
      </div>
    </section>
  );
}
