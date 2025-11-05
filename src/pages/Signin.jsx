import { useEffect, useState } from "react";
import img from "@/assets/3d-render-secure-login-password-illustration.png";
import img1 from "@/assets/logosiginin.png";
import logoLight from "/LogoBasicLight.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Building2, Chrome, Eye, EyeOff, User2, Users } from "lucide-react";

// Redux + Thunks (Supabase)
import { useDispatch } from "react-redux";
import { signInWithEmail } from "@/store/authThunks";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { setUser } from "@/store/authSlice";

function Signin() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { t } = useTranslation();
    const dispatch = useDispatch();

    // ✅ Handle email/password sign-in
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // استخدم unwrap عشان تحصل على النتيجة مباشرة أو throw error
            const result = await dispatch(
                signInWithEmail({ email, password })
            ).unwrap();

            toast.success(t("auth.signin.toast.success.title"), {
                description: t("auth.signin.toast.success.description"),
            });
        } catch (error) {
            console.error("Sign in failed:", error);
            toast.error(t("auth.signin.toast.error.title"), {
                description: error,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;

            // Open popup window
            const popup = window.open(
                data.url,
                "googlePopup",
                "width=500,height=600"
            );

            // Listen for auth completion
            const unsub = supabase.auth.onAuthStateChange(
                async (event, session) => {
                    if (event === "SIGNED_IN") {
                        unsub?.data?.subscription.unsubscribe();
                        popup?.close();

                        const user = session?.user;
                        if (!user) return toast.error("Login failed");

                        // Check if exists in our DB
                        const { data: dbUser } = await supabase
                            .from("users")
                            .select("*")
                            .eq("id", user.id)
                            .maybeSingle();

                        if (!dbUser) {
                            const newUser = {
                                id: user.id,
                                email: user.email,
                                full_name: user.user_metadata.full_name,
                                avatar:
                                    user.user_metadata.avatar_url ||
                                    user.user_metadata.picture ||
                                    null,
                                role: "client",
                            };

                            await supabase.from("users").insert(newUser);
                            dispatch(setUser(newUser));
                            navigate("/user");
                            toast.success(
                                t("auth.register.toast.success.title")
                            );
                        } else {
                            dispatch(setUser(dbUser));
                            navigate(
                                dbUser.role === "host" ? "/host" : "/user"
                            );
                            toast.success(t("auth.signin.toast.success.title"));
                        }
                    }
                }
            );
        } catch (err) {
            console.error(err);
            toast.error("Google sign-in failed");
        }
    };

    //stop service worker in browser so redirect works
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                registrations.forEach((registration) => {
                    registration.unregister();
                });
            });
        }
    }, []);

    return (
        <div className='flex flex-col font-poppins md:flex-row min-h-screen bg-background pt-16'>
            {/* Left column - form */}
            <div className='w-full md:w-1/2 flex items-start justify-center px-8  py-12'>
                <div className='w-full max-w-lg'>
                    <header className='mb-10'>
                        <Link to='/' className='flex items-center mb-6'>
                            <div className='w-[fit] dark:hidden'>
                                <img src={img1} alt='Logo' width={200} />
                            </div>
                            <div className='w-[fit] hidden dark:block'>
                                <img src={logoLight} alt='Logo' width={200} />
                            </div>
                        </Link>

                        <h1 className='text-[31.25px] font-extrabold text-primary leading-tight'>
                            {t("auth.signin.title")}
                        </h1>
                    </header>

                    <main>
                        {/* ✅ Google Sign-In Buttons (Client & Host) */}
                        <div className='space-y-2 mb-4'>
                            <Button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                variant='outline'
                                className={`w-full flex items-center justify-center gap-2 border border-amber/40 bg-white dark:bg-background hover:bg-amber/10 transition rounded-sm py-3 shadow-sm font-medium ${
                                    loading
                                        ? "opacity-60 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {!loading ? (
                                    <>
                                        <Chrome
                                            size={18}
                                            className='text-amber'
                                        />
                                        <span>
                                            {t("auth.signin.googleSignIn")}
                                        </span>
                                    </>
                                ) : (
                                    <div className='flex items-center gap-2'>
                                        <div className='w-4 h-4 border-2 border-amber border-t-transparent rounded-full animate-spin'></div>
                                        <span className='text-primary text-sm'>
                                            {t("common.loading") ??
                                                "Loading..."}
                                        </span>
                                    </div>
                                )}
                            </Button>

                            {/* Note */}
                            <div className=' text-xs text-center text-primary font-medium bg-card border border-violet/20 rounded-sm py-2 leading-tight'>
                                {t("auth.signin.googleNote")}
                                {/* Host CTA */}
                                <p className='mt-1'>
                                    {t("auth.signin.wantHost")}{" "}
                                    <Link
                                        to='/register'
                                        className='text-amber font-semibold underline hover:text-amber/80'
                                    >
                                        {t("auth.signin.createHost")}
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <div className='flex items-center my-6'>
                            <div className='flex-1 h-px bg-muted' />
                            <div className='px-4 text-sm text-text'>
                                {t("auth.signin.orUseEmail")}
                            </div>
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
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
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
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
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
                                        loading
                                            ? "opacity-70 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {loading
                                        ? t("common.buttons.signingIn")
                                        : t("common.buttons.letsGetStarted")}
                                </button>
                            </div>
                        </form>

                        <div className='mt-6 text-center font-[12.8px] text-text'>
                            <h5>
                                {t("auth.signin.notMember")}{" "}
                                <Link
                                    to='/register'
                                    className='text-primary underline font-[900]'
                                >
                                    {t("auth.signin.registerNow")}
                                </Link>
                            </h5>
                        </div>
                    </main>
                </div>
            </div>

            {/* Right column - image */}
            <div className='hidden md:w-1/2 md:flex items-center justify-center'>
                <div className=''>
                    <img
                        src={img}
                        alt='Register'
                        className='w-full object-cover'
                    />
                </div>
            </div>
        </div>
    );
}

export default Signin;
