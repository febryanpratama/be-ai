export interface ReminderRequest {
    nama_pengingat: string;
    kategori: string;
    tanggal: string;
    waktu_start: string;
    waktu_end: string;
    repeat: boolean;
}
export interface ReminderUpdateRequest {
    reminder_id: number;
    nama_pengingat: string;
    kategori: string;
    tanggal: string;
    waktu_start: string;
    waktu_end: string;
    repeat: boolean;
}