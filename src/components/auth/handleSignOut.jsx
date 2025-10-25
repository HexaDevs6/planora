// src/auth/handleSignOut.js
import Swal from "sweetalert2";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { clearUser } from "@/store/authSlice";
import { auth } from "@/lib/firebaseConfig";

export const handleSignOut = async (dispatch, navigate, t) => {
   const swalWithCustomStyles = Swal.mixin({
      customClass: {
         confirmButton:
            "px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-medium hover:opacity-90 transition-all",
         cancelButton:
            "px-5 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all",
         popup: "rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md",
         title: "text-xl font-semibold text-gray-900 dark:text-white",
         htmlContainer: "text-gray-600 dark:text-gray-300",
      },
      buttonsStyling: false,
   });

   swalWithCustomStyles
      .fire({
         title: t("auth.signout.alert.title"),
         text: t("auth.signout.alert.text"),
         icon: "warning",
         showCancelButton: true,
         confirmButtonText: t("auth.signout.alert.confirmButton"),
         cancelButtonText: t("auth.signout.alert.cancelButton"),
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

               toast.success(t("auth.signout.toast.success.title"), {
                  description: t("auth.signout.toast.success.description"),
               });
            } catch (error) {
               console.error("Error during sign out:", error);
               toast.error(t("auth.signout.toast.error.title"), {
                  description: t("auth.signout.toast.error.description"),
            	});
            }
         }
      });
};
