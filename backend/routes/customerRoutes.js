

import express from "express";


import {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomerById,
    deleteCustomerById
} from "../controllers/customerCRUDController.js";


import { importCustomersFromExcel } from "../controllers/excelImportController.js";
import { exportCustomersToExcel } from "../controllers/excelExportController.js";


import {
    uploadPolicyDocument as uploadPolicyDocumentController,
    getPolicyDocument
} from "../controllers/Policy_Document_Controller.js";


import { uploadPolicyDocument as uploadMiddleware } from "../utils/cloudinaryConfig.js";


import {
    validateCustomerAccess,
    validateAdminAccess,
    sessionLogger,
    ensureDataIsolation
} from "../middleware/authMiddleware.js";


const router = express.Router();







// Apply session logging to all routes
router.use(sessionLogger);

// Excel import/export (admin access required)
router.post("/import-excel", validateAdminAccess, importCustomersFromExcel);
router.get("/export-excel", validateAdminAccess, exportCustomersToExcel);

// Customer CRUD operations
// Note: For agent routes, customers are accessed via /api/agents/:id/customers
router.get("/", validateAdminAccess, getAllCustomers);
router.get("/:id", validateCustomerAccess, ensureDataIsolation('customer'), getCustomerById);
router.post("/", uploadMiddleware, createCustomer);
router.put("/:id", validateCustomerAccess, uploadMiddleware, ensureDataIsolation('customer'), updateCustomerById);
router.delete("/:id", validateAdminAccess, deleteCustomerById);

// Policy document operations (customer or agent access)
router.post("/:id/policy-document", validateCustomerAccess, uploadMiddleware, ensureDataIsolation('customer'), uploadPolicyDocumentController);
router.get("/:id/policy-document", validateCustomerAccess, ensureDataIsolation('customer'), getPolicyDocument);






export default router;