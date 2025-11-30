import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Modelpayment({ event, user, onPaymentSuccess }) {
  const [name, setName] = useState("");
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState("");

  // Initialize Stripe Elements
  const handleStripeInit = async () => {
    if (stripe) return;

    const s = await stripePromise;
    if (!s) return setCardError("Stripe failed to load");

    const e = s.elements();
    const cardEl = e.create("card");

    const mountPoint = document.getElementById("card-element");
    if (!mountPoint) return;

    cardEl.mount(mountPoint);
    cardEl.on("change", (ev) => setCardError(ev.error?.message || ""));

    setStripe(s);
    setElements(e);
    setCard(cardEl);
  };

  const handlePayment = async () => {
    if (!name) return setCardError("Please enter your name");
    if (!stripe || !elements || !card) return;

    setLoading(true);
    setCardError("");

    try {
      // 1) Create payment intent
      const response = await fetch(
        "https://planorabackend-production.up.railway.app/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: event.price }),
        }
      );

      const raw = await response.text();
      const data = JSON.parse(raw);

      if (!data.clientSecret) throw new Error("Invalid server response");

      // 2) Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card,
          billing_details: { name },
        },
      });

      if (result.error) {
        setCardError(result.error.message);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        // 🎯 أهم خطوة — أنادي ال Callback
        await onPaymentSuccess();

        // 🎉 Success message
        alert("Payment successful!");
      }
    } catch (err) {
      setCardError(err.message);
    }

    setLoading(false);
  };

  return (
    <Dialog onOpenChange={(open) => open && handleStripeInit()}>
      <DialogTrigger asChild>
        <Button variant="amber" className="w-full">Book Now</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <h2 className="text-xl font-bold mb-4">Complete Payment</h2>

        <div className="space-y-4">
          <Input 
            placeholder="Name on card"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div id="card-element" className="border rounded-md p-3 bg-background"></div>

          {cardError && <p className="text-red-600 text-sm">{cardError}</p>}

          <Button 
            className="w-full"
            variant="amber"
            disabled={loading}
            onClick={handlePayment}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : `Pay $${event.price}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
