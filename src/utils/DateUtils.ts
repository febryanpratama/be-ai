class DateUtils {

    // Fungsi untuk memformat tanggal menjadi "dd-MM-yyyy"
    public formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

// Fungsi untuk memformat tanggal menjadi "yyyy-MM-dd"
    public formatDateISO(date: Date): string {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

// Fungsi untuk memformat tanggal menjadi "dd MMM yyyy"
    public formatDateWithMonthName(date: Date): string {
        const day = String(date.getDate()).padStart(2, "0");
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const monthName = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${monthName} ${year}`;
    }

}

export default new DateUtils();
