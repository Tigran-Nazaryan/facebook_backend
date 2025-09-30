import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

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

export const createSingleUploadMiddleware = (
    fieldName = "coverPhoto",
    maxSize = 5 * 1024 * 1024
) => {
    const uploader = multer({
        storage,
        fileFilter,
        limits: { fileSize: maxSize },
    }).single(fieldName);

    return (req, res, next) => {
        uploader(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({
                        message: `The file is too large. Maximum ${maxSize / (1024 * 1024)}MB`,
                    });
                }
                if (err.code === "LIMIT_UNEXPECTED_FILE") {
                    return res.status(400).json({
                        message: `Invalid field. Expected: ${fieldName}`,
                    });
                }
                return res.status(400).json({ message: err.message });
            } else if (err) {
                return next(err);
            }
            next();
        });
    };
};

export const uploadCoverPhoto = createSingleUploadMiddleware("coverPhoto", 5 * 1024 * 1024);
