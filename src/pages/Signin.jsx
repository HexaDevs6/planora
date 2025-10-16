
import { useState } from "react";
import img from "@/assets/sign-img.png";
import img1 from "@/assets/logosiginin.png";
import { Link } from "react-router-dom";
function Signin() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col font-poppins md:flex-row min-h-screen bg-background">
            {/* Left column - form */}
            <div className="w-full md:w-1/2 flex items-start justify-center px-8 md:px-20 py-12 md:py-16">
                <div className="w-full max-w-lg">
                    <header className="mb-10">
                        <div className="flex items-center gap-3 mb-6">

                            <div className="w-[fit]">
                                <img src={img1} alt="Logo" />
                            </div>
                        </div>

                        <h1 className="text-[31.25px] font-extrabold text-violet leading-tight">
                            Where great events
                            <br />
                            begin.
                        </h1>
                    </header>

                    <main>
                        <div className="mb-6 flex items-center justify-center">
                            <button className="w-[360px]  flex items-center justify-center gap-3  bg-[#D6CED5] rounded-[48px] py-4 px-6 text-[#424242] hover:bg-gray-100">
                                <div className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[white]">
                                    <img
                                        src="https://www.svgrepo.com/show/355037/google.svg"
                                        alt="Google"
                                        className="w-[15px] h-[15px] bg-[white]  "
                                    />
                                </div>

                                <span className="text-sm text-[#424242] leading-[25.6px] font-[400] ">
                                    Sign in with Google
                                </span>
                            </button>
                        </div>

                        <div className="flex items-center my-6">
                            <div className="flex-1 h-px bg-gray-300" />
                            <div className="px-4 text-sm text-gray-500">Or use Email</div>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>

                        <form className="space-y-6">
                            <div className="relative w-full">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder=" "
                                    className="peer w-full border border-gray-300 rounded-md px-4 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
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
                                    placeholder=" "
                                    className="peer w-full border border-gray-300 rounded-md px-4 pt-5 pb-2 pr-12 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute left-4 top-2 text-[#616161] text-sm transition-all 
        peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 
        peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-amber"
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                        <mask id="mask0_26_60" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="17" height="17">
                                            <rect x="0.899902" y="0.840454" width="16" height="15.7193" fill="white" />
                                        </mask>
                                        <g mask="url(#mask0_26_60)">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M5.54582 2.45749C5.63962 2.3651 5.76699 2.31317 5.89982 2.31317C6.03265 2.31317 6.16002 2.3651 6.25382 2.45749L12.2538 8.35222C12.3479 8.44438 12.4007 8.56952 12.4007 8.70002C12.4007 8.83051 12.3479 8.95565 12.2538 9.0478L6.25382 14.9425C6.05833 15.1346 5.7414 15.1346 5.54588 14.9426C5.35036 14.7506 5.35028 14.4392 5.5457 14.2471L11.1928 8.70002L5.54582 3.15307C5.45178 3.06091 5.39893 2.93577 5.39893 2.80528C5.39893 2.67478 5.45178 2.54965 5.54582 2.45749H5.54582Z" fill="#EEEEEE" />
                                        </g>
                                    </svg>
                                </button>
                            </div>

                            <div className="text-center">
                                <p className="text-xs text-gray-500 mt-3">
                                    By Signing up to uBrand, means you agree to our{" "}
                                    <a className="underline">Privacy Policy</a> and{" "}
                                    <a className="underline">Terms of Service</a>
                                </p>
                            </div>
                        </form>
                        <div className="mt-6 text-center font-[12.8px] text-[#616161]">
                            <h5>Not a member yet?  <Link to="/register" className="text-violet  text-decoration-line: underline; font-[900] "> REGISTER NOW</Link></h5>
                        </div>
                    </main>
                </div>
            </div>

            {/* Right column - image */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-8">
                <div className="w-[420px] h-[600px] ">
                    <img src={img} alt="Register" className="w-full  object-cover" />
                </div>
            </div>
        </div>
    );
}

export default Signin;