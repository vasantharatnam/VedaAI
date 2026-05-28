import Router from "express"
import { createAssignment, deleteAssignment, getAssignmentById, getAssignments, getAssignmentJobStatus, getAssignmentResult, regenerateAssignment} from "../controllers/assignment.controller"
import { downloadAssignmentPdf } from "../controllers/pdf.controller";
import { upload } from "../middlewares/upload.middleware"
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router()

router.use(requireAuth);

router.post('/' , upload.single('file') , createAssignment);
router.get('/' , getAssignments);
router.get("/:assignmentId/status", getAssignmentJobStatus);
router.get("/:assignmentId/result", getAssignmentResult);
router.get("/:assignmentId/pdf", downloadAssignmentPdf);
router.post("/:assignmentId/regenerate", regenerateAssignment);
router.get('/:assignmentId' , getAssignmentById);
router.delete('/:assignmentId' , deleteAssignment);

export default router
