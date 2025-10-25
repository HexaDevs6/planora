// src/auth/handleSignOut.js
import Swal from "sweetalert2";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { clearUser } from "@/store/authSlice";
import { auth } from "@/lib/firebaseConfig";

export const handleSignOut = async (dispatch, navigate) => {
  const swalWithCustomStyles = Swal.mixin({
    customClass: {
      confirmButton:
        "px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-medium hover:opacity-90 transition-all",
      cancelButton:
        "px-5 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all",
      popup:
        "rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md",
      title: "text-xl font-semibold text-gray-900 dark:text-white",
      htmlContainer: "text-gray-600 dark:text-gray-300",
    },
    buttonsStyling: false,
  });

  swalWithCustomStyles
    .fire({
      title: "Log out of Planora?",
      text: "You can always sign in again later.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      backdrop: `
        rgba(0,0,0,0.4)
        left top
        no-repeat
      `,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        try {
          await signOut(auth);
          dispatch(clearUser());
          navigate("/");

          toast.success("Signed out successfully!", {
            description: "You’ve been logged out of your account.",
          });
        } catch (error) {
          console.error("Error during sign out:", error);
          toast.error("Sign-out failed", {
            description: "Please try again later.",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithCustomStyles.fire({
          title: "Cancelled",
          text: "You are still logged in 😊",
          icon: "info",
        });
      }
    });
};
