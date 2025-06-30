const BudgetHeader = () => {
  return (
    <div className="text-center mb-10">
      <div className="animate-fade-in-up">
        <h2 className="luxury-heading text-6xl sm:text-7xl text-luxury-black mb-6">
          <span className="luxury-subheading block text-luxury-gold-dark text-2xl sm:text-3xl mb-4 tracking-[0.3em]">
          Save in style
          </span>
          Look Good Spend Smart
        </h2>
      </div>
      <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <p className="luxury-body text-xl text-luxury-gray max-w-3xl mx-auto">
        Find fashion that fits your vibe and your wallet.
        </p>
      </div>
    </div>
  );
};

export default BudgetHeader;
