import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Lock, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useDirection } from "@/hooks/useDirection";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Modelpayment = ({ event, user, onPaymentSuccess }) => {
  console.log(user);
  
  const { lang } = useDirection();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [open, setOpen] = useState(false);
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { t } = useTranslation();
  // Initialize Stripe Elements with enhanced styling
  const handleStripeInit = useCallback(async () => {
    if (stripe) return;



    try {

      const s = await stripePromise;
      if (!s) {
        setCardError(t("payment.errors.paymentSystemFailed"));
        toast.error(t("payment.errors.paymentSystemFailed"));
        return;
      }

      const e = s.elements({
        fonts: [
          {
            cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
          },
        ],
      });

      const cardEl = e.create("card", {
        style: {
          base: {
            fontSize: "16px",
            color: "#1f2937",
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSmoothing: "antialiased",
            "::placeholder": {
              color: "#9ca3af",
            },
            iconColor: "#f59e0b",
          },
          invalid: {
            color: "#ef4444",
            iconColor: "#ef4444",
          },
          complete: {
            iconColor: "#10b981",
          },
        },
        hidePostalCode: true,
      });

      setStripe(s);
      setElements(e);
      setCard(cardEl);
    } catch (error) {
      console.error("Stripe initialization error:", error);
      setCardError(t("payment.errors.initializationFailed"));
      toast.error(t("payment.errors.initializationFailed"));
    }
  }, [stripe, t]);

  // Mount card element when it's ready
  useEffect(() => {
    if (card && open) {
      const mountPoint = document.getElementById("card-element");
      if (mountPoint && !mountPoint.hasChildNodes()) {
        try {
          card.mount(mountPoint);
  
          const handleCardChange = (ev) => {
            setCardError(ev.error?.message || "");
            setCardComplete(ev.complete);
          };
  
          card.on("change", handleCardChange);
  
          // Cleanup function to remove the event listener
          return () => {
            card.off("change", handleCardChange);
          };
        } catch (error) {
          console.error("Card mount error:", error);
          setCardError(t("payment.errors.cardLoadFailed"));
        }
      }
    }
  }, [card, open]);

  // Cleanup on dialog close
  const handleDialogChange = useCallback((isOpen) => {
    if (!user) {
      Swal.fire({
        title: t("payment.auth.loginPrompt"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--primary)",
        cancelButtonColor: "var(--secondary)",
        confirmButtonText: t("payment.auth.loginButton"),
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signin");
        }
      });
    }

    if (user.role === "host") {
      toast.error(t("payment.auth.hostRestriction"));
      return;
    }

    setOpen(isOpen);

    if (isOpen) {
      handleStripeInit();
      setEmail(user?.email || "");
    } else {
      // Cleanup
      if (card) {
        card.unmount();
        setCard(null);
      }
      setStripe(null);
      setElements(null);
      setName("");
      setCardError("");
      setCardComplete(false);
      setPaymentSuccess(false);
    }
  }, [user, navigate, t]);

  const handlePayment = useCallback(async () => {
    // Enhanced validation
    if (!name || name.trim().length < 2) {
      setCardError(t("payment.validation.nameRequired"));
      toast.error(t("payment.validation.nameToastError"));
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setCardError(t("payment.validation.emailInvalid"));
      toast.error(t("payment.validation.emailToastError"));
      return;
    }

    if (!stripe || !elements || !card) {
      setCardError(t("payment.validation.paymentNotReady"));
      return;
    }

    if (!cardComplete) {
      setCardError(t("payment.validation.cardIncomplete"));
      toast.error(t("payment.validation.cardToastError"));
      return;
    }

    if (!event?.price || event.price <= 0) {
      setCardError(t("payment.validation.invalidPrice"));
      toast.error(t("payment.validation.invalidPrice"));
      return;
    }

    if (!user?.id) {
      setCardError(t("payment.validation.userNotAuthenticated"));
      toast.error(t("payment.validation.loginRequired"));
      return;
    }

    setLoading(true);
    setCardError("");

    try {
      // Get authentication token
      const token = localStorage.getItem("token");

      // 1) Create payment intent with full details
      const response = await fetch(
        "https://planorabackend-production.up.railway.app/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          },
          body: JSON.stringify({
            amount: event.price,
            eventId: event.id || event._id,
            userId: user.id || user._id,
            eventName: event.name || event.title,
            userEmail: email
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || t("payment.errors.createIntentFailed"));
      }

      const data = await response.json();

      if (!data.clientSecret) {
        throw new Error(t("payment.errors.invalidServerResponse"));
      }

      // 2) Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: name.trim(),
            email: email.trim()
          },
        },
      });

      if (result.error) {
        setCardError(result.error.message);
        toast.error(result.error.message);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        setPaymentSuccess(true);

        try {
          // Call the success callback
          await onPaymentSuccess();

          // Show success message
          toast.success(t("payment.success.message"), {
            duration: 5000,
            icon: "🎉",
          });

          // Close dialog after a short delay
          setTimeout(() => {
            setOpen(false);
          }, 2000);

        } catch (bookingError) {
          console.error("Booking failed after payment:", bookingError);
          setCardError(
            `${t("payment.errors.bookingFailed")} ${result.paymentIntent.id}`
          );
          toast.error(t("payment.errors.bookingToastError"), {
            duration: 10000,
          });
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      setCardError(err.message || t("payment.errors.paymentFailed"));
      toast.error(err.message || t("payment.errors.paymentFailed"));
    } finally {
      setLoading(false);
    }
  }, [name, email, stripe, elements, card, cardComplete, event, user, t]);

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="amber" className="w-full mt-4 flex items-center justify-center gap-2">

            <CreditCard className="size-4" />
            {t("common.buttons.BookNow")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md sm:max-w-lg" lang={lang}>
        <AnimatePresence mode="wait">
          {paymentSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="size-16 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">{t("payment.dialog.successTitle")}</h3>
              <p className="text-muted-foreground">{t("payment.dialog.successMessage")}</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Sparkles className="size-6 text-amber-500" />
                  {t("payment.dialog.title")}
                </DialogTitle>
                <DialogDescription>
                  {t("payment.dialog.subtitle")}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-5">
                {/* Event Summary */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">{t("payment.dialog.eventLabel")}</p>
                      <p className="font-semibold">{lang === "ar" ? event.name_ar : event.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{t("payment.dialog.totalLabel")}</p>
                      <p className="text-2xl font-bold text-amber-600">{event?.price} EGP</p>
                    </div>
                  </div>
                </div>

                {/* Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    {t("payment.dialog.fullNameLabel")}
                    <span className="text-red-500">{t("payment.dialog.required")}</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder={t("payment.dialog.fullNamePlaceholder")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="transition-all focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    {t("payment.dialog.emailLabel")}
                    <span className="text-red-500">{t("payment.dialog.required")}</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("payment.dialog.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="transition-all focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Card Element */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CreditCard className="size-4" />
                    {t("payment.dialog.cardInfoLabel")}
                    <span className="text-red-500">{t("payment.dialog.required")}</span>
                  </Label>
                  <div
                    id="card-element"
                    className="border rounded-lg p-4 bg-background transition-all focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500"
                  />
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {cardError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg"
                    >
                      <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600 dark:text-red-400">{cardError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <Lock className="size-4" />
                  <p>{t("payment.dialog.securityNotice")}</p>
                </div>

                {/* Pay Button */}
                <Button
                  className="w-full h-12 text-base font-semibold"
                  variant="amber"
                  disabled={loading || !stripe || !cardComplete}
                  onClick={handlePayment}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-5 animate-spin" />
                      {t("payment.dialog.processingButton")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="size-4" />
                      {t("payment.dialog.payButton")} {event?.price || 0} EGP
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

export default memo(Modelpayment);

