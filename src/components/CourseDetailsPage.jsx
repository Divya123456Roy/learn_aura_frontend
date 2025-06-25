import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourseByIdAPI } from "../services/courseAPI";
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from "./CheckoutForm";
import { Test } from "./Test";
import { FaLock, FaCreditCard, FaCheckCircle, FaShieldAlt } from 'react-icons/fa'; // More icons

// Initialize Stripe outside the component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Coursedetailspage = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});
    const [showCheckout, setShowCheckout] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCourseDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                if (courseId) {
                    const data = await fetchCourseByIdAPI(courseId);
                    setCourse(data);
                    setLoading(false);
                } else {
                    setError("Course ID is missing from the URL.");
                    setLoading(false);
                }
            } catch (err) {
                setError(err.message || "Failed to load course details.");
                setLoading(false);
            }
        };

        loadCourseDetails();
    }, [courseId]);

    const handleBuy = () => {
        setShowCheckout(true);
    };

    const handleCancelCheckout = () => {
        setShowCheckout(false);
    };

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen w-full flex justify-center items-center"
            >
                <div className="loader"></div> {/* You might need custom CSS for this */}
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-gradient-to-br from-red-100 to-red-200 min-h-screen text-red-500 flex justify-center items-center"
            >
                <div className="p-4 rounded-md bg-red-50 border border-red-300">{error}</div>
            </motion.div>
        );
    }

    if (!course) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen flex justify-center items-center"
            >
                <div className="p-4 rounded-md bg-gray-50 border border-gray-300">Course not found.</div>
            </motion.div>
        );
    }

    const { title, description, price, originalPrice, instructorId, category, tags, learningOutcomes, modules } = course;

    const toggleModule = (moduleId) => {
        setExpandedModules((prevState) => ({
            ...prevState,
            [moduleId]: !prevState[moduleId],
        }));
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

    const staggerContainer = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-12"
        >
            <div className="container mx-auto max-w-6xl bg-white shadow-lg rounded-md overflow-hidden">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 md:grid-cols-2"
                >
                    {/* Left Side - Course Overview (unchanged, but consider subtle background) */}
                    <motion.div variants={fadeInUp} className="p-8 bg-gradient-to-br from-white to-gray-50">
                        {category && <div className="text-sm text-indigo-600 font-semibold mb-3">{category}</div>}
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
                        <p className="text-lg text-gray-700 mb-6">
                            🚀 Ignite your potential! Dive into this transformative course and unlock the skills you need to conquer the future. Get ready for an engaging learning experience that will elevate your expertise to new heights!
                        </p>
                        <motion.div variants={fadeInUp} className="mb-6 border rounded-md p-4 bg-indigo-50 bg-opacity-10 text-sm text-gray-700">
                            <h3 className="font-semibold text-indigo-800 mb-2">Why Choose This Stellar Course?</h3>
                            <p>
                                Our meticulously crafted curriculum, led by industry titans, offers a dynamic blend of theoretical knowledge and hands-on application. Expect interactive sessions, real-world projects, and a supportive community dedicated to your success. Take the leap and invest in your future today!
                            </p>
                        </motion.div>
                        {tags && tags.length > 0 && (
                            <div className="mb-4">
                                <span className="text-sm text-gray-500 mr-2">Explore Topics:</span>
                                {tags.map((tag) => (
                                    <motion.span
                                        key={tag}
                                        variants={fadeInUp}
                                        className="inline-block bg-indigo-100 rounded-full px-3 py-1 text-xs font-semibold text-indigo-700 mr-2 mb-1 hover:bg-indigo-200 cursor-pointer transition duration-200"
                                    >
                                        {tag}
                                    </motion.span>
                                ))}
                            </div>
                        )}
                        <p className="text-sm text-gray-500 mb-4">
                            Guided by <span className="font-semibold text-blue-700 hover:underline cursor-pointer">{instructorId?.profile?.firstName || "Unknown"} {instructorId?.profile?.lastName || "Unknown"}</span>
                        </p>
                        {learningOutcomes && learningOutcomes.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">What You'll Master</h2>
                                <ul className="list-disc pl-5 text-gray-700 text-sm">
                                    {learningOutcomes.map((outcome, index) => (
                                        <motion.li variants={fadeInUp} key={index}>{outcome}</motion.li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>

                    {/* Right Side - Attractive Purchase Information */}
                    <motion.div variants={fadeInUp} className="p-8 bg-gradient-to-br from-gray-100 to-white flex flex-col justify-start">
                        {!showCheckout ? (
                            <div className="rounded-md shadow-lg p-6">
                                <div className="relative rounded-md overflow-hidden mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-70 animate-pulse"></div>
                                    <div className="relative flex justify-center items-center py-8">
                                        <svg className="w-16 h-16 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l-7 7m0 0v-7m0 7h7m-7 3h7m-7-7h7"></path></svg>
                                        <span className="absolute text-lg font-semibold text-white">Preview Inside</span>
                                    </div>
                                </div>

                                <div className="mb-4 text-center">
                                    <p className="text-4xl font-extrabold text-green-600">${price}</p>
                                    {originalPrice && originalPrice > price && (
                                        <p className="text-sm text-gray-500 line-through">${originalPrice} <span className="text-red-600 font-semibold">Save ${(originalPrice - price).toFixed(2)}!</span></p>
                                    )}
                                    {originalPrice && originalPrice > price && (
                                        <p className="text-xs text-red-700 font-semibold animate-pulse">Limited-Time Offer!</p>
                                    )}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "#5c6bc0" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleBuy}
                                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-md transition duration-200 ease-in-out mb-3 shadow-md"
                                >
                                    <span className="text-lg flex items-center justify-center">
                                        <FaCreditCard className="mr-3 text-xl" /> **Enroll Now & Transform!**
                                    </span>
                                </motion.button>

                                <div className="text-sm text-gray-600 mb-3 flex items-center justify-center">
                                    <FaCheckCircle className="inline mr-2 -mt-0.5 w-5 h-5 text-green-500" />
                                    <span className="font-semibold">✅ Lifetime Access</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-4 flex items-center justify-center">
                                    <FaCheckCircle className="inline mr-2 -mt-0.5 w-5 h-5 text-green-500" />
                                    Earn a <span className="font-semibold">✅ Completion Certificate</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-4 flex items-center justify-center">
                                    <FaShieldAlt className="inline mr-2 -mt-0.5 w-5 h-5 text-blue-500" />
                                    <span className="font-semibold">🔒 Secure Payment Guaranteed</span>
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-md shadow-xl p-8"
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
                                    <FaCreditCard className="mr-2 text-indigo-600 text-xl" /> **Secure Payment Details**
                                </h2>
                                {stripePromise && course && (
                                    <Elements stripe={stripePromise}>
                                        <CheckoutForm course={course} setShowCheckout={setShowCheckout} navigate={navigate} />
                                    </Elements>
                                )}
                                <motion.button
                                    onClick={handleCancelCheckout}
                                    className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 rounded-md transition duration-200 ease-in-out"
                                >
                                    <span className="flex items-center justify-center">
                                        <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        Cancel
                                    </span>
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>

                {modules && modules.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delayChildren: 0.2, staggerChildren: 0.1 }}
                        className="p-8 mt-8 bg-white shadow-md rounded-md"
                    >
                        {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Content</h2> */}
                        {/* <motion.div variants={staggerContainer} initial="initial" animate="animate">
                            {modules.map((module) => (
                                <motion.div
                                    variants={fadeInUp}
                                    key={module._id}
                                    className="mb-4 border rounded-md overflow-hidden"
                                >
                                    <div
                                        className="bg-gray-100 p-3 cursor-pointer flex justify-between items-center"
                                        onClick={() => toggleModule(module._id)}
                                    >
                                        <h3 className="font-semibold text-gray-700">{module.title}</h3>
                                        <span>{expandedModules[module._id] ? '▲' : '▼'}</span>
                                    </div>
                                    {expandedModules[module._id] && (
                                        <div className="p-4 text-gray-600 text-sm">
                                            <ul className="list-disc pl-5">
                                                {module.lessons.map((lesson, index) => (
                                                    <li key={index} className="mb-1">{lesson.title}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div> */}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Coursedetailspage;