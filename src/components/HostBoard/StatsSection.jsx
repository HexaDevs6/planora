import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * Reusable Stats Component
 * @param {Array} stats - Array of objects containing: label, value, change, trend ("up" | "down")
 */
export default function Stats({ stats = [] }) {
    return (
        <section className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
            {stats.map((item, i) => (
                <div
                    key={i}
                    className='flex flex-col gap-2 rounded-xl p-6 bg-background border'
                >
                    <p className='text-base font-medium text-gray-700 dark:text-gray-300'>
                        {item.label}
                    </p>

                    <p className='text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
                        {item.value}
                    </p>

                    <div
                        className={`flex items-center gap-1 text-sm font-medium ${
                            item.trend === "up"
                                ? "text-green-500"
                                : "text-red-500"
                        }`}
                    >
                        {item.trend === "up" ? (
                            <TrendingUp className='w-4 h-4' />
                        ) : (
                            <TrendingDown className='w-4 h-4' />
                        )}
                        <span>{item.change}</span>
                    </div>
                </div>
            ))}
        </section>
    );
}
