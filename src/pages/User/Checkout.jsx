// import { useEffect, useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';

// const Checkout = () => {
//   const [stripe, setStripe] = useState(null);

//   useEffect(() => {
//     const initializeStripe = async () => {
//       const stripeInstance = await loadStripe("pk_test_51R3B48QZp8HlxlDzodvTaadEgXbZhTWsYPxqqcoDfwgJyaAZvrwvo8bQ7LKscORX2UVyCnT9Q2TbrLD08yoOGFJu00bhfZINbL");
//       console.log('Stripe initialized:', stripeInstance); // Debugging line
//       setStripe(stripeInstance);
//     };
//     initializeStripe();
//   }, []);

//   const handleCheckout = async () => {
//     try {
//       const response = await fetch('http://localhost:8000/api/payment/checkout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await response.json();
//       console.log('Backend Response:', data); // Debugging line

//       if (data.success) {
//         const result = await stripe.redirectToCheckout({
//           sessionId: data.sessionId,
//         });

//         if (result.error) {
//           console.error(result.error.message);
//         }
//       } else {
//         console.error('Failed to create checkout session');
//       }
//     } catch (error) {
//       console.error('Error during checkout:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Checkout</h1>
//       <button onClick={handleCheckout}>Proceed to Payment</button>
//     </div>
//   );
// };

// export default Checkout;

import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const Checkout = () => {
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await loadStripe(
        'pk_test_51R3B48QZp8HlxlDzodvTaadEgXbZhTWsYPxqqcoDfwgJyaAZvrwvo8bQ7LKscORX2UVyCnT9Q2TbrLD08yoOGFJu00bhfZINbL'
      );
      console.log('Stripe initialized:', stripeInstance); // Debugging line
      setStripe(stripeInstance);
    };
    initializeStripe();
  }, []);

  useEffect(() => {
    if (stripe) {
      const handleCheckout = async () => {
        try {
          const response = await fetch(
            'http://localhost:8000/api/payment/checkout',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const data = await response.json();
          console.log('Backend Response:', data); // Debugging line

          if (data.success) {
            const result = await stripe.redirectToCheckout({
              sessionId: data.sessionId,
            });

            if (result.error) {
              console.error(result.error.message);
            }
          } else {
            console.error('Failed to create checkout session');
          }
        } catch (error) {
          console.error('Error during checkout:', error);
        }
      };

      // Automatically trigger the checkout process
      handleCheckout();
    }
  }, [stripe]);

  return (
    <div>
      <h1>Checkout</h1>
      {/* No "Proceed to Payment" button */}
      <p>Redirecting to payment...</p>
    </div>
  );
};

export default Checkout;
