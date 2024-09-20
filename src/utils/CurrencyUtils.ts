class CurrencyUtils {
    public formatCurrency(amount: number): string {
        return amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
    }
}

export default new CurrencyUtils();
