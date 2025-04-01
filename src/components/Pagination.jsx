export function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null; // Hide pagination if there's only one page

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className='flex justify-center items-center gap-2 mt-4'>
            {/* Previous Button */}
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                    currentPage === 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 text-white"
                }`}>
                Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => onPageChange(index + 1)}
                    className={`px-4 py-2 rounded ${
                        currentPage === index + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                    }`}>
                    {index + 1}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 text-white"
                }`}>
                Next
            </button>
        </div>
    );
}
