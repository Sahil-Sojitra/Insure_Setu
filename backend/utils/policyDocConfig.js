

import multer from 'multer';
import path from 'path';
import fs from 'fs';






const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        const uploadDir = './uploads/policy_documents';

        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },

    
    filename: (req, file, cb) => {
        const userId = req.params.id || 'new';
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        cb(null, `policy-${userId}-${timestamp}${extension}`);
    }
});






const fileFilter = (req, file, cb) => {
    
    const fileExtension = path.extname(file.originalname).toLowerCase();

    
    if (fileExtension === '.pdf' && file.mimetype === 'application/pdf') {
        cb(null, true); 
    } else {
        cb(new Error('Only PDF files (.pdf) are allowed for policy documents!'), false);
    }
};






const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, 
        files: 1 
    }
});


export const uploadPolicyDocument = upload.single('policyDocument');


export const deleteDocument = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Policy document deleted: ${filePath}`);
        return true;
    }
    return false;
};