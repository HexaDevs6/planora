import { useState } from "react";
import img from "@/assets/sign-img.png";
import img1 from "@/assets/logosiginin.png";
import logoLight from "/LogoBasicLight.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";

// Redux + Thunks (Supabase)
import { useDispatch } from "react-redux";
import { signInWithEmail, registerUserWithGoogle } from "@/store/authThunks";

/**
 * Signin component
 * - UI kept exactly as original
 * - Replaced Firebase logic with Supabase thunks (signInWithEmail, registerUserWithGoogle)
 * - Uses local loading state to preserve button disabled/visual behaviour
 */
function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Handle email/password sign-in using the RTK thunk (supabase)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Dispatch the thunk. It returns an object like { success: true/false, user?, error? }
      const result = await dispatch(signInWithEmail(email, password));

      if (result && result.success) {
        toast.success(t("auth.signin.toast.success.title"), {
          description: t("auth.signin.toast.success.description"),
        });

        // small delay to show toast (keeps original UX)
        setTimeout(() => {
          navigate("/user/overview");
        }, 1500);
      } else {
        // show error from thunk if available, otherwise generic
        const message =
          (result && result.error) ||
          t("auth.signin.toast.error.description") ||
          "Sign in failed";
        console.log("login failed with email:", message);
        toast.error(t("auth.signin.toast.error.title"), {
          description: message,
        });
      }
    } catch (error) {
      console.log("login failed with email:", error?.message || error);
      toast.error(t("auth.signin.toast.error.title"), {
        description: t("auth.signin.toast.error.description"),
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign-in using the RTK thunk (supabase)
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      // This thunk will call supabase.auth.signInWithOAuth({ provider: 'google' })
      // Behavior: for redirect flow, user will be redirected to Google (and return later).
      // For popup flow (if supported), it may return user data immediately.
      const result = await dispatch(registerUserWithGoogle({ userType: "client" }));

      // If thunk returned success and user data, proceed to navigate (keeps original UX)
      if (result && result.success) {
        toast.success(t("auth.signin.toast.googleSuccess.title"), {
          description: t("auth.signin.toast.googleSuccess.description"),
        });

        setTimeout(() => {
          navigate("/user/overview");
        }, 1500);
      } else {
        // In many Supabase OAuth setups the call causes a redirect and does not return user immediately.
        // If result indicates no immediate user, still show an info toast and let redirect handle the flow.
        toast.success(t("auth.signin.toast.googleSuccess.title"), {
          description:
            (result && result.error) ||
            t("auth.signin.toast.googleSuccess.description") ||
            "Redirecting to Google...",
        });
      }
    } catch (error) {
      console.log("Sign-in failed with Google:", error?.message || error);
      toast.error(t("auth.signin.toast.googleError.title"), {
        description: t("auth.signin.toast.googleError.description"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col font-poppins md:flex-row min-h-screen bg-background pt-16'>
      {/* Left column - form */}
      <div className='w-full md:w-1/2 flex items-start justify-center px-8 md:px-20 py-12 md:py-16'>
        <div className='w-full max-w-lg'>
          <header className='mb-10'>
            <div className='flex items-center mb-6'>
              <div className='w-[fit] dark:hidden'>
                <img src={img1} alt='Logo' width={200} />
              </div>
              <div className='w-[fit] hidden dark:block'>
                <img src={logoLight} alt='Logo' width={200} />
              </div>
            </div>

            <h1 className='text-[31.25px] font-extrabold text-primary leading-tight'>
              {t("auth.signin.title")}
            </h1>
          </header>

          <main>
            {/* Google Sign-In Button */}
            <div className='mb-6 flex items-center justify-center'>
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-3 bg-[#D6CED5] rounded-sm py-4 px-6 text-[#424242] hover:bg-gray-100 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <div className='w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[white]'>
                  <img
                    src='https://www.svgrepo.com/show/355037/google.svg'
                    alt='Google'
                    className='w-[15px] h-[15px] bg-[white]'
                  />
                </div>
                <span className='text-sm text-[#424242] leading-[25.6px] font-[400]'>
                  {t("auth.signin.googleSignIn")}
                </span>
              </button>
            </div>

            <div className='flex items-center my-6'>
              <div className='flex-1 h-px bg-muted' />
              <div className='px-4 text-sm text-text'>{t("auth.signin.orUseEmail")}</div>
              <div className='flex-1 h-px bg-muted' />
            </div>

            {/* Email & Password form */}
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='relative w-full'>
                <input
                  type='email'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=' '
                  required
                  className='peer w-full border rounded-sm px-4 pt-5 pb-2 text-primary placeholder-transparent focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent'
                />
                <label
                  htmlFor='email'
                  className='absolute left-4 top-2 text-[#616161] text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-amber'
                >
                  {t("common.form.email")}
                </label>
              </div>

              <div className='relative w-full'>
                <input
                  type={showPassword ? "text" : "password"}
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=' '
                  required
                  className='peer w-full border rounded-sm px-4 pt-5 pb-2 pr-12 text-primary placeholder-transparent focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent'
                />
                <label
                  htmlFor='password'
                  className='absolute left-4 top-2 text-[#616161] text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-amber'
                >
                  {t("common.form.password")}
                </label>

                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-amber'
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <div>
                <button
                  type='submit'
                  disabled={loading}
                  className={`w-full bg-violet hover:brightness-110 text-white font-semibold py-4 rounded-md shadow-inner flex items-center justify-center gap-2 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? t("common.buttons.signingIn") : t("common.buttons.letsGetStarted")}
                </button>
              </div>
            </form>

            <div className='mt-6 text-center font-[12.8px] text-text'>
              <h5>
                {t("auth.signin.notMember")}{" "}
                <Link to='/register' className='text-primary underline font-[900]'>
                  {t("auth.signin.registerNow")}
                </Link>
              </h5>
            </div>
          </main>
        </div>
      </div>

      {/* Right column - image */}
      <div className='w-full md:w-1/2 flex items-center justify-center px-8'>
        <div className='w-[420px] h-[600px]'>
          <img src={img} alt='Register' className='w-full object-cover' />
        </div>
      </div>
    </div>
  );
}

export default Signin;
