import { useState } from "react";
import img from "@/assets/sign-img.png";
import img1 from "@/assets/logosiginin.png";
import logoLight from "/LogoBasicLight.png";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebaseConfig";
import { toast } from "sonner";

function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successful!", {
        description: "Welcome back to Planora!",
      });

      setTimeout(() => {
         navigate("/user/overview");
      }, 1500);
    } catch (error) {
      toast.error("Login failed!", {
        description: error.message,
      });
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in with Google!", {
        description: "Welcome to Planora!",
      });

      setTimeout(() => {
      navigate("/user/overview");
      }, 1500);
    } catch (error) {
      toast.error("Google Sign-In failed!", {
        description: error.message,
      });
    }
  };

  return (
    <div className="flex flex-col font-poppins md:flex-row min-h-screen bg-background pt-16">
      {/* Left column - form */}
      <div className="w-full md:w-1/2 flex items-start justify-center px-8 md:px-20 py-12 md:py-16">
        <div className="w-full max-w-lg">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[fit] dark:hidden">
                <img src={img1} alt="Logo" width={200} />
              </div>
              <div className="w-[fit] hidden dark:block">
                <img src={logoLight} alt="Logo" width={200} />
              </div>
            </div>

            <h1 className="text-[31.25px] font-extrabold text-violet leading-tight">
              Where great events
              <br />
              begin.
            </h1>
          </header>

          <main>
            {/* Google Sign-In Button */}
            <div className="mb-6 flex items-center justify-center">
              <button
                onClick={handleGoogleSignIn}
                className="w-[360px] flex items-center justify-center gap-3 bg-[#D6CED5] rounded-[48px] py-4 px-6 text-[#424242] hover:bg-gray-100"
              >
                <div className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[white]">
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google"
                    className="w-[15px] h-[15px] bg-[white]"
                  />
                </div>
                <span className="text-sm text-[#424242] leading-[25.6px] font-[400]">
                  Sign in with Google
                </span>
              </button>
            </div>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-muted" />
              <div className="px-4 text-sm text-gray-500">Or use Email</div>
              <div className="flex-1 h-px bg-muted" />
            </div>

            {/* Email & Password form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative w-full">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  required
                  className="peer w-full border rounded-md px-4 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-2 text-[#616161] text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-amber"
                >
                  Email
                </label>
              </div>

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  required
                  className="peer w-full border rounded-md px-4 pt-5 pb-2 pr-12 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-2 text-[#616161] text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-amber"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-amber"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-violet hover:brightness-110 text-white font-semibold py-4 rounded-md shadow-inner flex items-center justify-center gap-2"
                >
                  Let’s Get Started
                </button>
              </div>
            </form>

            <div className="mt-6 text-center font-[12.8px] text-[#616161]">
              <h5>
                Not a member yet?{" "}
                <Link
                  to="/register"
                  className="text-violet underline font-[900]"
                >
                  REGISTER NOW
                </Link>
              </h5>
            </div>
          </main>
        </div>
      </div>

      {/* Right column - image */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8">
        <div className="w-[420px] h-[600px]">
          <img src={img} alt="Register" className="w-full object-cover" />
        </div>
      </div>
    </div>
  );
}

export default Signin;
