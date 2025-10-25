import BudgetColumns from './budget/BudgetColumns';
import SectionHeading from './shared/SectionHeading';

const BudgetSection = () => {
  const budgetRanges = ['Under 499', 'Under 799', 'Under 999', 'Under 1299', 'Above 1499'];

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Look Good Spend Smart"
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-8"
        />
        <BudgetColumns budgetRanges={budgetRanges} />
      </div>
    </section>
  );
};

export default BudgetSection;
