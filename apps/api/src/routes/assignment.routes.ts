import Router from "express"
import { createAssignment, deleteAssignment, getAssignmentById, getAssignments } from "../controllers/assignment.controller"
import { upload } from "../middlewares/upload.middleware"

const router = Router()


router.post('/' , upload.single('file') , createAssignment);
router.get('/' , getAssignments);
router.get('/:assignmentId' , getAssignmentById);
router.delete('/:assignmentId' , deleteAssignment);

export default router