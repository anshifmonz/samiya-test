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
    <section className="py-20 px-4 bg-luxury-beige">
      <BudgetHeader />
      <BudgetColumns budgetRanges={budgetRanges} />
    </section>
  );
};

export default BudgetSection;
