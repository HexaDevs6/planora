import React from "react";

export default function ChartCard({ title, subtitle, children }) {
    return (
        <div
            className='
            flex
            flex-col
            justify-between
        w-full 
        rounded-sm
        p-3 
        bg-card 
        text-card-foreground 
        shadow-[0_4px_20px_rgba(0,0,0,0.05)]
        dark:shadow-[0_4px_25px_rgba(0,0,0,0.25)]
        border border-border 
        transition-all 
        duration-300 
        hover:shadow-[0_6px_25px_rgba(0,0,0,0.08)]
        dark:hover:shadow-[0_6px_25px_rgba(0,0,0,0.35)]
        hover:border-amber/60
        animate-fadeIn
      '
            style={{
                borderRadius: "var(--radius-xl)",
                fontFamily: "var(--font-poppins)",
            }}
        >
            {/* Header Section */}
            {(title || subtitle) && (
                <div className='mb-4'>
                    {title && (
                        <h2
                            className='
                text-lg 
                font-semibold 
                text-foreground 
                tracking-wide
                mb-1
              '
                            style={{
                                fontFamily: "var(--font-cairo)",
                            }}
                        >
                            {title}
                        </h2>
                    )}

                    {subtitle && (
                        <p
                            className='
                text-sm 
                text-muted-foreground
                font-normal
              '
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            {/* Chart Container */}
            <div
                className='
          mt-3
          w-full
          overflow-x-auto
          flex-center
        '
            >
                {children}
            </div>
        </div>
    );
}
