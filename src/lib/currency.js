function formatCurrency({ amount, currency }) {
  return new Intl.NumberFormat("nb-NO", { style: "currency", currency }).format(
    amount
  );
}

module.exports = {
  formatCurrency,
};
