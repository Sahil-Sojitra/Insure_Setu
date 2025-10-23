// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import multer from 'multer';

// // Configure Cloudinary with optimizations
// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET,
//     secure: true, // Use HTTPS
// });

// // Create Cloudinary storage for policy documents with optimizations
// const policyDocumentStorage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'crm_policy_documents', // Folder name in Cloudinary
//         allowed_formats: ['pdf', 'doc', 'docx'], // Only allow document formats
//         resource_type: 'raw', // Use 'raw' for non-image files like PDFs
//         use_filename: true, // Use original filename
//         unique_filename: false, // Don't add random suffix
//         overwrite: false, // Don't overwrite existing files
//         public_id: (req, file) => {
//             // Generate a cleaner unique filename
//             const timestamp = Date.now();
//             const originalName = file.originalname.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, '_'); // Clean name
//             return `policy_${timestamp}_${originalName}`;
//         },
//     },
// });

// // Create optimized multer upload middleware for policy documents
// const upload = multer({
//     storage: policyDocumentStorage,
//     limits: {
//         fileSize: 5 * 1024 * 1024, // Reduced to 5MB for faster upload
//         files: 1, // Only one file at a time
//     },
//     fileFilter: (req, file, cb) => {
//         // Check file type
//         const allowedMimes = [
//             'application/pdf',
//             'application/msword',
//             'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//         ];

//         if (allowedMimes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only PDF, DOC, and DOCX files are allowed (max 5MB)'), false);
//         }
//     },
// });

// // Export the middleware function
// export const uploadPolicyDocument = upload.single('policyDocument');

// // Function to delete a file from Cloudinary
// export const deleteFromCloudinary = async (publicId) => {
//     try {
//         const result = await cloudinary.uploader.destroy(publicId, {
//             resource_type: 'raw' // Specify resource type for non-image files
//         });
//         console.log('File deleted from Cloudinary:', result);
//         return result;
//     } catch (error) {
//         console.error('Error deleting file from Cloudinary:', error);
//         throw error;
//     }
// };

// // Function to get file URL from Cloudinary
// export const getCloudinaryUrl = (publicId) => {
//     return cloudinary.url(publicId, {
//         resource_type: 'raw',
//         flags: 'attachment' // Force download when accessed
//     });
// };

// export default cloudinary;

import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});

// Multer memory storage (store files in memory before uploading)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 5MB
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed (max 5MB)'), false);
        }
    },
});

// Upload buffer to Cloudinary (raw files like PDFs)
export const uploadPolicyDocumentToCloudinary = (fileBuffer, folder = 'crm_policy_documents') => {
    return new Promise((resolve, reject) => {
        const timestamp = Date.now();
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'raw',
                use_filename: true,
                unique_filename: false,
                overwrite: false,
                public_id: `policy_${timestamp}`,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

// Middleware for Express routes
export const uploadPolicyDocument = upload.single('policyDocument');

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        console.log('File deleted from Cloudinary:', result);
        return result;
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw error;
    }
};

// Get file URL
export const getCloudinaryUrl = (publicId) => {
    return cloudinary.url(publicId, { resource_type: 'raw', flags: 'attachment' });
};

export default cloudinary;
