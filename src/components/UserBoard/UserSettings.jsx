import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";

export default function ProfileSettings() {
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.displayName || "",
                email: user.email || "",
                phone: user.phoneNumber || "",
                location:
                    user.location?.city && user.location?.country
                        ? `${user.location.city}, ${user.location.country}`
                        : "",
                emailNotifications: true,
                pushNotifications: true,
                smsNotifications: false,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Profile Updated:", formData);
        // TODO: later => dispatch(updateUserProfile(formData))
    };

    return (
        <main className='flex-1 overflow-y-auto'>
            <div className='container py-10'>
                {/* Header */}
                <header className='mb-10'>
                    <h1 className='text-3xl font-bold text-primary mb-2'>
                        Profile & Settings
                    </h1>
                    <p className='text-base text-muted-foreground'>
                        Manage your personal details, notification preferences,
                        and payment methods.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className='space-y-12'>
                    {/* Personal Details */}
                    <section>
                        <h2 className='text-2xl font-semibold text-primary border-b border-border pb-4 mb-6'>
                            Personal Details
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {[
                                {
                                    id: "fullName",
                                    label: "Full Name",
                                    type: "text",
                                },
                                {
                                    id: "email",
                                    label: "Email Address",
                                    type: "email",
                                },
                                {
                                    id: "phone",
                                    label: "Phone Number",
                                    type: "tel",
                                },
                                {
                                    id: "location",
                                    label: "Location",
                                    type: "text",
                                },
                            ].map(({ id, label, type }) => (
                                <div key={id} className='flex flex-col'>
                                    <label
                                        htmlFor={id}
                                        className='mb-2 text-sm font-medium text-muted-foreground'
                                    >
                                        {label}
                                    </label>
                                    <input
                                        id={id}
                                        name={id}
                                        type={type}
                                        value={formData[id]}
                                        onChange={handleChange}
                                        className='w-full rounded-sm border border-border bg-surface px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all'
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Notification Preferences */}
                    <section>
                        <h2 className='text-2xl font-semibold text-primary border-b border-border pb-4 mb-6'>
                            Notification Preferences
                        </h2>
                        <div className='space-y-4 bg-surface p-6 rounded-sm'>
                            {[
                                {
                                    name: "emailNotifications",
                                    label: "Email Notifications",
                                },
                                {
                                    name: "pushNotifications",
                                    label: "Push Notifications",
                                },
                                {
                                    name: "smsNotifications",
                                    label: "SMS Notifications",
                                },
                            ].map(({ name, label }) => (
                                <label
                                    key={name}
                                    className='flex items-center justify-between text-sm font-medium text-foreground'
                                >
                                    {label}
                                    <input
                                        type='checkbox'
                                        name={name}
                                        checked={formData[name]}
                                        onChange={handleChange}
                                        className='h-5 w-5 rounded-sm border border-border text-primary focus:ring-2 focus:ring-primary'
                                    />
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Payment Methods */}
                    <section>
                        <h2 className='text-2xl font-semibold text-primary border-b border-border pb-4 mb-6'>
                            Payment Methods
                        </h2>
                        <div className='bg-surface p-6 rounded-sm space-y-4'>
                            <div className='flex items-center justify-between border-b border-border pb-3'>
                                <div className='flex items-center gap-4'>
                                    <div
                                        className='h-8 w-12 bg-center bg-no-repeat bg-contain'
                                        style={{
                                            backgroundImage:
                                                "url('https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg')",
                                        }}
                                    ></div>
                                    <div>
                                        <p className='text-sm font-medium text-foreground'>
                                            Visa ending in 1234
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            Expires 05/25
                                        </p>
                                    </div>
                                </div>
                                <Button variant='ghost' size='sm'>
                                    Edit
                                </Button>
                            </div>

                            <button
                                type='button'
                                className='w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-sm text-muted-foreground hover:border-primary/50 hover:bg-primary/5 transition-all'
                            >
                                + Add Payment Method
                            </button>
                        </div>
                    </section>

                    {/* Security */}
                    <section>
                        <h2 className='text-2xl font-semibold text-primary border-b border-border pb-4 mb-6'>
                            Security
                        </h2>
                        <div className='bg-surface p-6 rounded-sm'>
                            <Button variant='outline' size='lg'>
                                Change Password
                            </Button>
                        </div>
                    </section>

                    {/* Save Button */}
                    <div className='flex justify-end pt-6 border-t border-border'>
                        <Button variant='primary' size='lg' type='submit'>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}
