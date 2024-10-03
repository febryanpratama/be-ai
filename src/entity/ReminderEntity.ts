export interface ReminderRequest {
    nama_pengingat: string;
    categoryId: number;
    tanggal: string;
    waktu_start: string;
    waktu_end: string;
    repeat: boolean;
    remind: number;
}
export interface ReminderUpdateRequest {
    reminder_id: number;
    nama_pengingat: string;
    categoryId: number;
    tanggal: string;
    waktu_start: string;
    waktu_end: string;
    repeat: boolean;
    remind: number;
}