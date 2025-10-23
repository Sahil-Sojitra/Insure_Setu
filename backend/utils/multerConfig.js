

import multer from 'multer';
import path from 'path';
import fs from 'fs';






const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        const uploadDir = './uploads';

        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },

    
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        cb(null, `excel-import-${timestamp}${extension}`);
    }
});






const fileFilter = (req, file, cb) => {
    
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    
    const allowedMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
        'application/vnd.ms-excel' 
    ];

    if (allowedExtensions.includes(fileExtension) && allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); 
    } else {
        cb(new Error('Only Excel files (.xlsx, .xls) are allowed!'), false);
    }
};






const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, 
        files: 1 
    }
});


export const uploadExcel = upload.single('excelFile');


export const cleanupFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Temporary file deleted: ${filePath}`);
    }
};