import Router from "express"
import { createAssignment, deleteAssignment, getAssignmentById, getAssignments, getAssignmentJobStatus } from "../controllers/assignment.controller"
import { downloadAssignmentPdf } from "../controllers/pdf.controller";
import { upload } from "../middlewares/upload.middleware"

const router = Router()


router.post('/' , upload.single('file') , createAssignment);
router.get('/' , getAssignments);
router.get("/:assignmentId/status", getAssignmentJobStatus);
router.get("/:assignmentId/pdf", downloadAssignmentPdf);
router.get('/:assignmentId' , getAssignmentById);
router.delete('/:assignmentId' , deleteAssignment);

export default router