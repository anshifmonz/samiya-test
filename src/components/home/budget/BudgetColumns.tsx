const BudgetColumns = ({ budgetRanges }: { budgetRanges: string[] }) => {
  return (
    <div className="grid grid-cols-2 gap-2 ml-32 mr-32">
      {budgetRanges.slice(0, 4).map((range, index) => (
        <button
          key={index}
          className="bg-card border border-gray-300 py-4 px-6 rounded-sm transition-all duration-300 hover:shadow-md font-inter font-medium text-gray-700 hover:text-gray-900"
        >
          {range}
        </button>
      ))}
      {budgetRanges.length > 4 && (
        <button
          key={4}
          className="bg-card border border-gray-300 py-4 px-6 rounded-sm transition-all duration-300 hover:shadow-md font-inter font-medium text-gray-700 hover:text-gray-900 col-span-2"
        >
          {budgetRanges[4]}
        </button>
      )}
    </div>
  );
};

export default BudgetColumns;
