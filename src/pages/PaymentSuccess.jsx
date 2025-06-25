import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Assuming you have Heroicons installed
import { useSelector } from 'react-redux';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const test = useSelector((state)=>state.course)
  const courseId = useSelector((state)=>state.course.courseId)
  console.log(test);
  

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate(`/student/course/${courseId}`); // Or your desired success route
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, [navigate]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-50 min-h-screen flex justify-center items-center py-12"
    >
      <motion.div
        variants={fadeInUp}
        className="bg-white shadow-lg rounded-md p-8 text-center"
      >
        <div className="flex justify-center items-center mb-4">
          <CheckCircleIcon className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">Your purchase was successful. You will be redirected shortly.</p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="animate-pulse text-sm text-gray-500"
        >
          Redirecting in 1.5 seconds...
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentSuccess;