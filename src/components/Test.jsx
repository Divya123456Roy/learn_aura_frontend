import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntentAPI, handlePaymentSuccessAPI } from '../services/userAPI'; // Assuming you put the API calls here
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CARD_OPTIONS = {
    iconStyle: 'solid',
    style: {
      base: {
        iconColor: '#c4f0ff',
        color: '#000', // Changed text color to black for better visibility on white background
        fontWeight: 500,
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': { color: '#fce883' },
        '::placeholder': { color: '#87bbfd' },
      },
      invalid: {
        color: '#ffc7ee',
      },
    },
  };

export const Test = ({ course, setShowCheckout, navigate }) => {
    const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  console.log(course);
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js is loaded.
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // 1. Create Payment Intent on the server
      const response = await createPaymentIntentAPI({ courseId: course._id });
      const { clientSecret } = response;

      // 2. Confirm the payment on the client
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: event.target.name.value, // You might want to collect more billing info
          },
        },
      });

      if (paymentResult.error) {
        setError(`Payment failed: ${paymentResult.error.message}`);
        toast.error(`Payment failed: ${paymentResult.error.message}`);
      } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
          console.log('Payment succeeded!', paymentResult.paymentIntent);
          toast.success('Payment successful!');
          // 3. Call your backend to handle successful payment (enroll user, create order)
          const successResponse = await handlePaymentSuccessAPI({
            paymentIntentId: paymentResult.paymentIntent.id,
            courseId: course._id,
          });

          if (successResponse.message) {
            toast.success(successResponse.message);
            setShowCheckout(false);
            navigate('/my-courses'); // Redirect to user's courses page
          } else {
            toast.error('Failed to finalize order. Please contact support.');
            setError('Failed to finalize order. Please contact support.');
          }
        }
      }
    } catch (err) {
      console.error('Error during payment:', err);
      setError(`An error occurred: ${err.message}`);
      toast.error(`An error occurred: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };
  return (
    <div className="p-6 mt-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Secure Payment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name on Card
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="card" className="block text-gray-700 text-sm font-bold mb-2">
            Card Details
          </label>
          <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <CardElement options={CARD_OPTIONS} id="card" />
          </div>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          type="submit"
          disabled={processing || !stripe || !elements}
          className={`w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 rounded focus:outline-none focus:shadow-outline ${
            processing || !stripe || !elements ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {processing ? 'Processing...' : `Pay $${course?.price}`}
        </button>
        <button
          type="button"
          className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 rounded focus:outline-none focus:shadow-outline"
          onClick={() => setShowCheckout(false)}
        >
          Cancel
        </button>
      </form>
      <toast.Container />
    </div>
  )
}
