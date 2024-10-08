import { Post, Route, Tags, UploadedFile, Controller, Body} from "tsoa";
import { SpeechClient, protos } from "@google-cloud/speech"; // protos digunakan untuk tipe bawaan dari API
import fs from 'fs';
import { ApiError } from "utils/apiError";
import { errors } from "config/errors";
import multer from 'multer';
import path from 'path';
import httpStatus from "http-status";
import { createResponse } from "config/ResponseData";

const client = new SpeechClient();
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, "../../../../composite-map-437502-p6-1f028922e66e.json"); // credential google speech api

// Setup Multer storage to save file in local directory (./uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../../uploads");
        
        // Create uploads folder if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
        }

        console.debug(uploadPath);

        cb(null, uploadPath); // Save to uploads directory
    },
    filename: (req, file, cb) => {
        // Use original file name (you can modify this if necessary)
        cb(null, file.originalname);
    }
});

// Initialize Multer with disk storage
const upload = multer({ storage });


@Route("audio")
@Tags("Audio")
export class AudioController extends Controller {

    /**
     * Konversi file audio menjadi teks
     * @param audio file audio yang akan dikonversi
     */
    @Post("/convert")
    public async convertAudioToText(@UploadedFile("audio") audio: Express.Multer.File): Promise<any> {

        try {
            // if (!audio || !audio.path) {
            //     throw new Error("No audio file uploaded or path is undefined.");
            //   }
        
            // const audioFilePath = audio.path;  // get file path from upload (aneh tidak jalan upload nya)
            const audioFilePath = path.join(__dirname, '../../../../uploads/testest.mp3'); // testing mengunakan file path static
        
        
            // Baca file audio yang telah di-upload
            const audioBytes = fs.readFileSync(audioFilePath).toString('base64');
        
            const audioConfig: protos.google.cloud.speech.v1.RecognitionAudio = {
                content: audioBytes,
                toJSON: () => ({}), // Menambahkan method toJSON sebagai dummy
            } as protos.google.cloud.speech.v1.RecognitionAudio;
        
            // Tambahkan properti opsional yang tersisa
            const config: protos.google.cloud.speech.v1.RecognitionConfig = {
                encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.MP3, // Gunakan enum AudioEncoding (encoding nya harus di tentuin .wav (LINEAR16) atau .mp3 (MP3))
                sampleRateHertz: 48000, // Sesuaikan sample rate (sample rate nya harus ada default nya, file audio harus sama samplerate hz nya)
                languageCode: "id-ID",  // Ubah bahasa sesuai keinginan
                audioChannelCount: 2, // Contoh nilai default untuk stereo = 2, mono = 1
                enableSeparateRecognitionPerChannel: false, // Default false
                maxAlternatives: 1, // Hanya ambil alternatif terbaik
                profanityFilter: false, // Tidak memfilter kata kasar
                enableWordTimeOffsets: false, // Tidak menyertakan waktu untuk setiap kata
                enableAutomaticPunctuation: false, // Tidak menggunakan tanda baca otomatis
                model: "default", // Model default pengenalan suara
                useEnhanced: false, // Tidak menggunakan model yang lebih canggih
                alternativeLanguageCodes: [], // Kosongkan jika tidak ada bahasa alternatif
                speechContexts: [], // Kosongkan jika tidak ada konteks spesifik
                enableWordConfidence: false, // Tidak menghitung confidence untuk setiap kata
                toJSON: () => ({}), // Menambahkan method toJSON untuk memenuhi tipe
            };
        
            // Menambahkan toJSON ke request
            const request: protos.google.cloud.speech.v1.RecognizeRequest = {
                audio: audioConfig,
                config: config,
                toJSON: () => ({ audio: audioConfig, config: config }), // Menambahkan method toJSON untuk request
            };
            console.log(request);
        
            try {
                // Panggil API dan tunggu Promise selesai
                const [response] = await client.recognize(request); // Menggunakan destructuring
                
                // Periksa apakah response dan results ada
                if (!response || !response.results || response.results.length === 0) {
                throw new Error("No results found.");
                }

                console.log(response);
        
                // Ambil hasil transkripsi dari response
                const transcription = response.results
                .map(result => result.alternatives![0].transcript)
                .join("\n");

                this.setStatus(httpStatus.OK)
                return createResponse(transcription);
            } catch (error: any) {
                console.error(error);
                throw new ApiError(errors.INTERNAL_SERVER_ERROR);
            } finally {
                // Hapus file setelah diproses
                // fs.unlinkSync(audioFilePath);
            }

        } catch (error: any) {
            console.error(error);
            throw new ApiError(errors.INTERNAL_SERVER_ERROR);
        }
        
    }
  
}