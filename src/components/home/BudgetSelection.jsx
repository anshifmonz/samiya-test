import { BudgetHeader, BudgetColumns } from "./budget";

const BudgetSection = () => {
  const budgetRanges = [
    "Under 499",
    "Under 799",
    "Under 999",
    "Under 1299",
    "Above 1499"
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <BudgetHeader />
        <BudgetColumns budgetRanges={budgetRanges} />
      </div>
    </section>
  );
};

export default BudgetSection;
