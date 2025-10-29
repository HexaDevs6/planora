import { Star, StarHalf } from "lucide-react";

/**
 * ReviewsSection Component
 * Displays a summary of ratings and a list of user reviews.
 *
 * @param {Array} reviews - Array of review objects:
 * {
 *   id: string,
 *   title: string,
 *   content: string,
 *   rating: number, // 1–5
 *   author?: string,
 *   date?: string
 * }
 */
const ReviewsSection = ({ reviews = [] }) => {
    // حساب المتوسط العام للتقييمات
    const averageRating =
        reviews.length > 0
            ? (
                  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              ).toFixed(1)
            : 0;

    // دالة لعرض النجوم حسب التقييم
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        return (
            <div className='flex text-amber'>
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={i} size={14} fill='currentColor' />
                ))}
                {hasHalfStar && <StarHalf size={14} fill='currentColor' />}
                {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map(
                    (_, i) => (
                        <Star
                            key={`empty-${i}`}
                            size={14}
                            className='text-border-light dark:text-border-dark'
                        />
                    )
                )}
            </div>
        );
    };

    return (
        <div className='p-4 bg-card  rounded-sm shadow-sm border border-border-light dark:border-border-dark'>
            {/* Header */}
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-primary font-semibold '>Recent Reviews</h3>
            </div>

            {/* Rating Summary */}
            <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-2'>
                    <p className='text-amber text-2xl font-bold'>
                        {averageRating}
                    </p>
                    {renderStars(averageRating)}
                    <p className=' text-sm font-normal ml-auto'>
                        Based on {reviews.length} reviews
                    </p>
                </div>

                {/* Reviews List */}
                <div className='divide-y divide-border-light dark:divide-border-dark'>
                    {reviews.length === 0 ? (
                        <p className='text-subtext-light dark:text-subtext-dark text-sm text-center py-6'>
                            No reviews yet.
                        </p>
                    ) : (
                        reviews.slice(0, 3).map((review) => (
                            <div key={review.id} className='py-3'>
                                <div className='flex items-center gap-2 mb-1'>
                                    <p className='text-sm font-semibold'>
                                        "{review.title}"
                                    </p>
                                    {renderStars(review.rating)}
                                </div>
                                <p className='text-subtext-light dark:text-subtext-dark text-sm font-normal line-clamp-2'>
                                    {review.content}
                                </p>
                                {review.author && (
                                    <p className='text-xs text-text mt-1'>
                                        - {review.author}
                                        {review.date && ` • ${review.date}`}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewsSection;
