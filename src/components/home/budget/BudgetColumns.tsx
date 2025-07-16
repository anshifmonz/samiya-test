"use client";

import { useRouter } from 'next/navigation';

const BudgetColumns = ({ budgetRanges }: { budgetRanges: string[] }) => {
  const router = useRouter();

  const handleBudgetClick = (range: string) => {
    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    if (range === "Under 499") {
      maxPrice = 499;
    } else if (range === "Under 799") {
      maxPrice = 799;
    } else if (range === "Under 999") {
      maxPrice = 999;
    } else if (range === "Under 1299") {
      maxPrice = 1299;
    } else if (range === "Above 1499") {
      minPrice = 1499;
    }

    const params = new URLSearchParams();
    if (minPrice !== undefined) params.set('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.set('maxPrice', maxPrice.toString());
    params.set('source', 'budget');

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-2 gap-1 sm:gap-2 mx-auto max-w-[1110px]">
      {budgetRanges.slice(0, 4).map((range, index) => (
        <button
          key={index}
          onClick={() => handleBudgetClick(range)}
          className="bg-card border border-gray-300 py-3 sm:py-4 lg:py-4 px-4 sm:px-6 lg:px-6 rounded-xl transition-all duration-300 hover:shadow-md font-inter font-medium text-sm sm:text-base lg:text-lg text-gray-700 hover:text-gray-900"
        >
          {range}
        </button>
      ))}
      {budgetRanges.length > 4 && (
        <button
          key={4}
          onClick={() => handleBudgetClick(budgetRanges[4])}
          className="bg-card border border-gray-300 py-3 sm:py-4 lg:py-6 px-4 sm:px-6 lg:px-8 rounded-xl transition-all duration-300 hover:shadow-md font-inter font-medium text-sm sm:text-base lg:text-lg text-gray-700 hover:text-gray-900 col-span-2"
        >
          {budgetRanges[4]}
        </button>
      )}
    </div>
  );
};

export default BudgetColumns;
