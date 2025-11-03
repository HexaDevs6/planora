// src/auth/handleSignOut.js
import Swal from "sweetalert2";
import { toast } from "sonner";
import { signOut } from "@/store/authThunks";

export const handleSignOut = async (dispatch, navigate, t) => {
  const swalWithCustomStyles = Swal.mixin({
    customClass: {

      confirmButton: `
        px-5 py-2.5 rounded-lg font-semibold
        bg-transparent border border-violet-400
        text-violet-700 dark:text-violet-200
        hover:bg-violet-100/60 dark:hover:bg-violet-900/40
        transition-all duration-300 shadow-sm
      `,

      cancelButton: `
        px-5 py-2.5 rounded-lg font-semibold text-white
        bg-[var(--color-violet)] hover:bg-[var(--color-violet-light)]
        dark:bg-[var(--color-violet)] dark:hover:bg-[var(--color-violet-light)]
        shadow-md hover:shadow-lg hover:scale-[1.02]
        transition-all duration-300
      `,

      popup: `
        rounded-2xl shadow-xl border border-violet-100 dark:border-violet-800
        bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.8),rgba(247,233,255,0.9))]
        dark:bg-[linear-gradient(to_bottom_right,rgba(31,7,28,0.95),rgba(51,12,47,0.9))]
        backdrop-blur-md
      `,

      title: `
        text-xl font-bold text-violet-800 dark:text-amber-400
      `,
      htmlContainer: `
        text-gray-700 dark:text-gray-300
      `,
      actions: `
        flex justify-center gap-5 mt-6
      `,
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
        rgba(0,0,0,0.35)
        left top
        no-repeat
      `,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(signOut());
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