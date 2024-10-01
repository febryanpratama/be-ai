import {client} from "root/src/db/db";
import {ApiError} from "utils/apiError";
import {errors} from "config/errors";

class ReminderService {
    public get = async (userId: number): Promise<any> => {
        const dataReminder = await client().reminder.findMany({
            where : {
                userId
            }
        })

        return dataReminder;
    }

    public postReminder = async (body: any, userId: number): Promise<any> => {
        const parsedDate = new Date(body.tanggal);

        const storeReminder = await client().reminder.create({
            data: {
                userId,
                nama_pengingat: body.nama_pengingat,
                kategori: body.kategori,
                tanggal: parsedDate,
                WaktuStart: body.waktu_start,
                WaktuEnd: body.waktu_end,
                Remind: body.reminder || false
            }
        })
    }

    public detailReminder = async(reminderId: number, userId: number): Promise<any> => {
        const detailReminder = await client().reminder.findFirst({
            where: {
                id: reminderId,
                userId
            }
        })

        if(!detailReminder){
            throw new ApiError(errors.DATA_NOT_FOUND);
        }

        return detailReminder;
    }
}

export default new ReminderService();