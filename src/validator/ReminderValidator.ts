import {LoginRequest} from "root/src/entity/AuthEntity";
import {validator} from "root/src/validator/Validator";
import {ReminderRequest, ReminderDetailRequest} from "root/src/entity/ReminderEntity";

export const validateReminder = (fields: ReminderRequest) => {
    validator.string(fields.nama_pengingat);
    validator.string(fields.tanggal)
    validator.string(fields.waktu_start)
    validator.string(fields.waktu_end)
    validator.boolean(fields.repeat)
    validator.number(fields.remind)
};

export const validateReminderDetail = (fields: ReminderDetailRequest) => {
    validator.string(fields.tanggapan)
};