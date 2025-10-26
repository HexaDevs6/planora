import React from "react";

export default function RecentMessages({ messages = [] }) {
    return (
        <section className='rounded-sm p-6 bg-card shadow-sm border border-gray-100 dark:border-neutral-800'>
            {/* Header */}
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
                    Recent Messages
                </h3>
                <a
                    href='#'
                    className='text-primary dark:text-amber text-sm font-semibold hover:underline'
                >
                    View All
                </a>
            </div>

            {/* Messages List */}
            <div className='divide-y divide-gray-100 dark:divide-neutral-800'>
                {messages.map((msg, i) => (
                    <div key={i} className='flex items-center gap-4 py-3'>
                        {/* Avatar */}
                        <div
                            className='bg-center bg-no-repeat bg-cover rounded-full h-12 w-12 flex-shrink-0'
                            style={{ backgroundImage: `url(${msg.avatar})` }}
                            aria-label={`${msg.name} avatar`}
                        ></div>

                        {/* Message Info */}
                        <div className='flex-1 min-w-0'>
                            <p className='text-sm font-semibold text-gray-900 dark:text-gray-100 leading-normal truncate'>
                                {msg.name}
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-400 leading-normal truncate'>
                                {msg.message}
                            </p>
                        </div>

                        {/* Time */}
                        <div className='shrink-0'>
                            <p className='text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap'>
                                {msg.time}
                            </p>
                        </div>
                    </div>
                ))}

                {/* If no messages */}
                {messages.length === 0 && (
                    <p className='text-sm text-gray-500 dark:text-gray-400 text-center py-4'>
                        No recent messages.
                    </p>
                )}
            </div>
        </section>
    );
}
