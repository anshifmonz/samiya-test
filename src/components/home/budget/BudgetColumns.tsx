const BudgetColumns = ({ budgetRanges }: { budgetRanges: string[] }) => {
  return (
    <div className="grid grid-cols-2 gap-1 sm:gap-2 mx-auto max-w-[1110px]">
      {budgetRanges.slice(0, 4).map((range, index) => (
        <button
          key={index}
          className="bg-card border border-gray-300 py-3 sm:py-4 lg:py-4 px-4 sm:px-6 lg:px-6 rounded-xl transition-all duration-300 hover:shadow-md font-inter font-medium text-sm sm:text-base lg:text-lg text-gray-700 hover:text-gray-900"
        >
          {range}
        </button>
      ))}
      {budgetRanges.length > 4 && (
        <button
          key={4}
          className="bg-card border border-gray-300 py-3 sm:py-4 lg:py-6 px-4 sm:px-6 lg:px-8 rounded-xl transition-all duration-300 hover:shadow-md font-inter font-medium text-sm sm:text-base lg:text-lg text-gray-700 hover:text-gray-900 col-span-2"
        >
          {budgetRanges[4]}
        </button>
      )}
    </div>
  );
};

export default BudgetColumns;
