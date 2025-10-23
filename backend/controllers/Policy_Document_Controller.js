

import { query } from '../utils/connectToDB.js';
import { getCustomerByIdQuery } from '../utils/sqlQuery.js';
import fs from 'fs';
import path from 'path';
import { deleteFromCloudinary } from '../utils/cloudinaryConfig.js';
import cloudinary from '../utils/cloudinaryConfig.js';


export async function uploadPolicyDocument(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No PDF file uploaded. Please select a valid PDF file.'
            });
        }

        // Cloudinary file path (URL)
        const filePath = req.file.path;

        res.status(200).json({
            success: true,
            message: 'Policy document uploaded successfully to Cloudinary',
            filePath: filePath,
            cloudinaryUrl: req.file.path,
            publicId: req.file.public_id
        });
    } catch (error) {
        // Delete from Cloudinary if upload fails
        if (req.file && req.file.public_id) {
            try {
                await deleteFromCloudinary(req.file.public_id);
            } catch (err) {
                console.error('Error deleting file from Cloudinary:', err);
            }
        }

        next(error);
    }
}


export async function getPolicyDocument(req, res, next) {
    try {
        const { id } = req.params;
        const { action = 'view' } = req.query; // 'view' or 'download'

        console.log(`Policy document request for customer ${id}, action: ${action}`);

        // Get customer from database
        const { rows } = await query(getCustomerByIdQuery, [id]);

        // Check if customer exists
        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        const policyDocPath = rows[0].policy_document;
        console.log(`Policy document path: ${policyDocPath}`);

        // Check if policy document exists
        if (!policyDocPath) {
            return res.status(404).json({
                success: false,
                message: 'No policy document found for this customer'
            });
        }

        // Check if it's a Cloudinary URL
        if (policyDocPath.includes('cloudinary.com')) {
            console.log('Cloudinary document found, original URL:', policyDocPath);

            // For Cloudinary URLs, ensure we're using HTTPS
            let baseUrl = policyDocPath;
            if (baseUrl.startsWith('http://')) {
                baseUrl = baseUrl.replace('http://', 'https://');
            }

            // Clean URL - remove any existing parameters for consistency
            const cleanUrl = baseUrl.split('?')[0];

            if (action === 'download') {
                // For download: proxy the file through our server with proper headers
                try {
                    const https = await import('https');
                    const http = await import('http');

                    const protocol = cleanUrl.startsWith('https') ? https : http;

                    // Set download headers
                    const filename = `policy_document_${id}.pdf`;
                    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                    res.setHeader('Content-Type', 'application/pdf');

                    // Stream the file from Cloudinary to the client
                    protocol.get(cleanUrl, (cloudinaryRes) => {
                        cloudinaryRes.pipe(res);
                    }).on('error', (err) => {
                        console.error('Error streaming from Cloudinary:', err);
                        res.status(500).json({
                            success: false,
                            message: 'Failed to download policy document'
                        });
                    });

                    return; // Don't send JSON response when streaming
                } catch (streamError) {
                    console.error('Error setting up stream:', streamError);
                    // Fallback to URL with attachment flag
                    const documentUrl = `${cleanUrl}?fl_attachment=true`;
                    return res.status(200).json({
                        success: true,
                        message: 'Policy document found',
                        documentUrl: documentUrl,
                        isCloudinary: true,
                        action: action
                    });
                }
            } else {
                // For view: use clean URL without any flags to prevent automatic download
                const documentUrl = cleanUrl;

                console.log('Serving document for view:', {
                    action,
                    originalUrl: policyDocPath,
                    cleanUrl,
                    documentUrl
                });

                return res.status(200).json({
                    success: true,
                    message: 'Policy document found',
                    documentUrl: documentUrl,
                    isCloudinary: true,
                    action: action
                });
            }
        } else {
            // Handle local files (backward compatibility)
            const fullPath = path.join('.', policyDocPath);
            if (!fs.existsSync(fullPath)) {
                return res.status(404).json({
                    success: false,
                    message: 'Policy document file not found'
                });
            }

            // Set appropriate headers for PDF viewing/downloading
            const filename = path.basename(policyDocPath);

            if (action === 'download') {
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            } else {
                res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.sendFile(path.resolve(fullPath));
        }

    } catch (error) {
        console.error('Error in getPolicyDocument:', error);
        next(error);
    }
}