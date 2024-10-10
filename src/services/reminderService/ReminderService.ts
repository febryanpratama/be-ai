import {client} from "root/src/db/db";
import {ApiError} from "utils/apiError";
import {errors} from "config/errors";
import { pusher } from "../../integration/pusher";

class ReminderService {
    public get = async (userId: number): Promise<any> => {
        const dataReminder = await client().reminder.findMany({
            where : {
                userId
            },
            include : {
                category: {
                    include: {
                        categoryDetail : true
                    }
                }
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
                categoryId: body.categoryId,
                tanggal: parsedDate,
                WaktuStart: body.waktu_start,
                WaktuEnd: body.waktu_end,
                Remind: body.repeat || false,
                countdown: body.remind
            }
        })

        return storeReminder;
    }

    public detailReminder = async(reminderId: number, userId: number): Promise<any> => {
        const detailReminder = await client().reminder.findFirst({
            where: {
                id: reminderId,
                userId
            },
            include: {
                category: true,
            }
        })

        if(!detailReminder){
            throw new ApiError(errors.DATA_NOT_FOUND);
        }

        return detailReminder;
    }

    public updateReminder = async(body:any, userId:number): Promise<any> => {
        const parsedDate = new Date(body.tanggal);

        const checkReminder = await client().reminder.findFirst({
            where:{
                id: body.reminder_id,
                userId
            }
        })

        if(!checkReminder){
            throw new ApiError(errors.DATA_NOT_FOUND)
        }

        const updateReminder = await client().reminder.update({
            where:{
                id: body.reminder_id,
                userId
            },data : {
                nama_pengingat: body.nama_pengingat,
                categoryId: body.categoryId,
                tanggal: parsedDate,
                WaktuStart: body.waktu_start,
                WaktuEnd: body.waktu_end,
                Remind: body.repeat || false,
                countdown: body.remind
            }
        })

        return updateReminder;
    }

    public deleteReminder = async (reminderId: number, userId: number): Promise<any> => {
        const deleteReminder = await client().reminder.delete({
            where: {
                id:reminderId,
                userId
            }
        })

        if(!deleteReminder){
            throw new ApiError(errors.DATA_NOT_FOUND)
        }

        return deleteReminder;
    }

    public getNotifReminder = async (): Promise<any> => {
        const date = new Date((new Date).toLocaleString("en-US", {
            timeZone: "Asia/Jakarta"
        }));
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const endOfDay = new Date(now.setHours(23, 59, 59, 999));
        const currentHour = ("0" + date.getHours()).slice(-2)
        const currentMinute = ("0" + date.getMinutes()).slice(-2)
        const currentMinutePlus = ("0" + (date.getMinutes() +1)).slice(-2)
        const hourNow = currentHour+":"+currentMinute;
        const hourNowPlus = currentHour+":"+currentMinutePlus;


        const dataReminder = await client().reminder.findMany({
            where : {
                tanggal: {
                    gte: startOfDay, // Lebih besar atau sama dengan awal hari
                    lte: endOfDay,   // Lebih kecil atau sama dengan akhir hari
                },
                WaktuStart: {
                    gte: hourNow, // Lebih besar atau sama dengan awal jam
                    lte: hourNowPlus, 
                }
            }
        })

        // send notif
        dataReminder.map(async (item:any) => {
            // send notif here
            // console.log(item.nama_pengingat)
            // Kirim notifikasi menggunakan Pusher
            await pusher.trigger("notification-reminder-channel", `user-${item.userId}`, {
                data:item
            });
        });

        return dataReminder;
    }
}

export default new ReminderService();