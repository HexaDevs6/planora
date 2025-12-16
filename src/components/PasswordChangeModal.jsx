import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordStrengthMeter } from "@/components/strength-meter";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const translations = {
    en: {
        changePassword: "Change Password",
        oldPassword: "Current password",
        enterNewPassword: "New password",
        confirmPassword: "Confirm new password",
        updatePassword: "Update Password",
        updating: "Updating...",
        cancel: "Cancel",
        passwordMatch: "Passwords match",
        passwordMismatch: "Passwords do not match",
        wrongOldPassword: "Wrong current password",
        success: "Password updated successfully",
        error: "Failed to update password",
    },
    ar: {
        changePassword: "تغيير كلمة المرور",
        oldPassword: "كلمة المرور الحالية",
        enterNewPassword: "كلمة المرور الجديدة",
        confirmPassword: "تأكيد كلمة المرور الجديدة",
        updatePassword: "تحديث كلمة المرور",
        updating: "جاري التحديث...",
        cancel: "إلغاء",
        passwordMatch: "كلمات المرور متطابقة",
        passwordMismatch: "كلمات المرور غير متطابقة",
        wrongOldPassword: "كلمة المرور الحالية غير صحيحة",
        success: "تم تحديث كلمة المرور بنجاح",
        error: "فشل في تحديث كلمة المرور",
    },
};

export function PasswordChangeModal({ lang = "en", user }) {
    const t = translations[lang];

    const [isOpen, setIsOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const PASSWORD_REGEX =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1) match new & confirm
        if (newPassword !== confirmPassword) {
            toast.error(t.passwordMismatch);
            return;
        }

        // 2) validate strength
        if (!PASSWORD_REGEX.test(newPassword)) {
            toast.error(
                lang === "ar"
                    ? "كلمة المرور لا تحقق الشروط"
                    : "Password does not meet requirements"
            );
            return;
        }

        setIsLoading(true);

        try {
            // 3) reauthenticate with old password
            const { error: oldPassErr } =
                await supabase.auth.signInWithPassword({
                    email: user.email,
                    password: oldPassword,
                });

            if (oldPassErr) {
                toast.error(
                    lang === "ar"
                        ? "كلمة المرور الحالية غير صحيحة"
                        : "Wrong current password"
                );
                setIsLoading(false);
                return;
            }

            if (newPassword === oldPassword) {
                toast.error(
                    lang === "ar"
                        ? "لا يمكن أن تكون كلمة المرور الجديدة هي نفس كلمة المرور الحالية"
                        : "New password cannot be the same as the current password"
                );
                return;
            }

            // 4) update password
            Promise.resolve().then(async () => {
                const { error } = await supabase.auth.updateUser({
                    password: newPassword,
                });

                if (error) {
                    toast.error(t.error);
                    return;
                }
            });

            setIsOpen(false);

            Swal.fire({
                icon: "success",
                title:
                    lang === "ar" ? "تم تحديث كلمة المرور" : "Password updated",
                text:
                    lang === "ar"
                        ? "سيتم تحديث الجلسة الآن"
                        : "Your session will be refreshed now",
                confirmButtonText: lang === "ar" ? "حسناً" : "OK",
            }).then(() => {
                // safest way
                navigate(0);
            });
        } catch (err) {
            console.error(err);
            toast.error(t.error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button variant='outline' size='lg' onClick={() => setIsOpen(true)}>
                {t.changePassword}
            </Button>

            {isOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center'>
                    <div
                        className='absolute inset-0 bg-black/50'
                        onClick={() => setIsOpen(false)}
                    />

                    <div
                        className='relative bg-background rounded-lg shadow-xl w-full max-w-md mx-4'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex items-center justify-between p-6 border-b'>
                            <h2 className='text-lg font-semibold'>
                                {t.changePassword}
                            </h2>
                            <button onClick={() => setIsOpen(false)}>
                                <X className='h-4 w-4' />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className='p-6 space-y-5'>
                            {/* Old password */}
                            <Input
                                type='password'
                                placeholder={t.oldPassword}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />

                            {/* New password */}
                            <PasswordStrengthMeter
                                lang={lang}
                                value={newPassword}
                                onValueChange={setNewPassword}
                                placeholder={t.enterNewPassword}
                                enableAutoGenerate
                                autoGenerateLength={16}
                            />

                            {/* Confirm password */}
                            <div className='space-y-1'>
                                <Input
                                    type='password'
                                    placeholder={t.confirmPassword}
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />

                                {confirmPassword && (
                                    <p
                                        className={`text-sm ${
                                            newPassword === confirmPassword
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {newPassword === confirmPassword
                                            ? t.passwordMatch
                                            : t.passwordMismatch}
                                    </p>
                                )}
                            </div>

                            <div className='flex gap-2'>
                                <Button
                                    type='submit'
                                    disabled={
                                        isLoading ||
                                        !oldPassword ||
                                        !newPassword ||
                                        newPassword !== confirmPassword
                                    }
                                >
                                    {isLoading ? t.updating : t.updatePassword}
                                </Button>

                                <Button
                                    variant='outline'
                                    onClick={() => setIsOpen(false)}
                                >
                                    {t.cancel}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
