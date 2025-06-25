import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Services() {
  const services = [
    {
      title: "Interactive Learning",
      description: "Engage with courses through videos, quizzes, and live sessions.",
      icon: "\ud83d\udcda",
    },
    {
      title: "Community Support",
      description: "Connect with peers and mentors for collaborative learning.",
      icon: "\ud83e\udd1d",
    },
    {
      title: "Course Management",
      description: "Create, edit, and manage courses seamlessly.",
      icon: "\ud83d\udee0\ufe0f",
    },
    {
      title: "Analytics & Progress Tracking",
      description: "Monitor student engagement and course effectiveness.",
      icon: "\ud83d\udcca",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      {/* Navbar */}
      {/* <Navbar className="w-full" /> */}
      
      {/* Main Content */}
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white text-gray-800 shadow-lg rounded-xl p-6 flex items-center space-x-4 transition-transform transform hover:scale-105">
              <span className="text-4xl">{service.icon}</span>
              <div>
                <h2 className="text-xl font-semibold mb-1">{service.title}</h2>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
   
  );
}
