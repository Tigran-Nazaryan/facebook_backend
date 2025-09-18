import multer from "multer";
import path from "path";
import {existsSync, mkdirSync} from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public");
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, {recursive: true});

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/\s+/g, "_");
        cb(null, `${name}-${Date.now()}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (/^image\/(jpeg|png|gif|webp)$/.test(file.mimetype)) cb(null, true);
    else cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
};

export const createUploadMiddleware = ({maxCount = 10, perFileSize = 5 * 1024 * 1024} = {}) => {
    const uploader = multer({
        storage,
        fileFilter,
        limits: {
            files: maxCount,
            fileSize: perFileSize,
        },
    }).any();

    return (req, res, next) => {
        uploader(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") {
                   return res.status(400).json({
                       message: "File is too large"
                   })
                }
                return next(err);
            } else if (err) {
                return next(err);
            }
            return next();
        });
    };
};

const multerMiddleware = createUploadMiddleware();

export default multerMiddleware;
