import React from 'react';

const Checkout = () => {
  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Include any necessary body data here
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe Checkout error:', error);
      }
    } catch (error) {
      console.error('Error creating Checkout Session:', error);
    }
  };

  return (
    <button onClick={handleCheckout}>
      Checkout
    </button>
  );
};

export default Checkout;
