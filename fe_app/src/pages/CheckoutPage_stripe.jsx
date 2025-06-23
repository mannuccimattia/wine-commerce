import axios from "axios";

export const handleStripeCheckout = async () => {
  const cartItems = JSON.parse(localStorage.getItem("carrello")) || [];
  const SPESE_SPEDIZIONE = 8.9;
  const SOGLIA_SPEDIZIONE = 300;
  const subtotal = cartItems.reduce((acc, item) => acc + item.prezzo * item.qty, 0);
  const shippingCost = subtotal > SOGLIA_SPEDIZIONE ? 0 : SPESE_SPEDIZIONE;

  try {
    await axios.post(
      "http://localhost:3000/api/order/stripe/create-checkout-session",
      { cartItems, shippingCost }
    );
  } catch {
    alert("Errore durante il collegamento a Stripe");
  }
};
