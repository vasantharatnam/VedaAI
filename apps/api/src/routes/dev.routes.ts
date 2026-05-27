import { Router } from "express"
import { AssignmentModel } from "../models/assignment.model"


const router = Router()

router.post("/test-assignment",  async (_req , res, next) => {
     try {
        const assignment = await AssignmentModel.create({
            title: "Sample AI Assessment",
            subject: "Science",
            className: "Class 10",
            dueDate:  new Date(),
             questionTypes: [
            {
               type: "Multiple Choice Questions",
               count: 5,
               marks: 1,
            },
             {
              type: "Short Questions",
              count: 3,
              marks: 2,
             },
            ],
            additionalInstructions: "Generate balanced questions.",
             status: "pending",
           })

             res.status(201).json({
              success: true,
            data: assignment,
           });
     }
     catch (error) {
        next(error);
     }
});

export default router;