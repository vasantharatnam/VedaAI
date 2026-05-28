import PDFDocument from "pdfkit";
import { Response } from "express";
import { QuestionPaper } from "../types/assignment.types";

const formatDifficulty = (difficulty: string) => {
  if (difficulty === "medium") return "Moderate";
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
};

const ensureSpace = (doc: PDFKit.PDFDocument, height: number) => {
  const bottomLimit = doc.page.height - doc.page.margins.bottom - 36;

  if (doc.y + height > bottomLimit) {
    doc.addPage();
  }
};

export const generateQuestionPaperPdf = (
  res: Response,
  paper: QuestionPaper
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 48,
      bufferPages: true,
    });

    doc.on("error", reject);
    doc.on("end", resolve);

    doc.pipe(res);

    // Header
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text(paper.schoolName, { align: "center" });

    doc
      .moveDown(0.4)
      .fontSize(13)
      .font("Helvetica-Bold")
      .text("Question Paper", { align: "center" });

    doc.moveDown(1);

    // Meta Info
    const metaY = doc.y;
    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const colWidth = pageWidth / 2;

    doc.fontSize(10).font("Helvetica");

    doc.text(`Subject: ${paper.subject}`, doc.page.margins.left, metaY, {
      width: colWidth,
    });

    doc.text(
      `Class: ${paper.className}`,
      doc.page.margins.left + colWidth,
      metaY,
      {
        width: colWidth,
        align: "right",
      },
    );

    doc.moveDown(0.8);

    const secondMetaY = doc.y;

    doc.text(
      `Time Allowed: ${paper.timeAllowed}`,
      doc.page.margins.left,
      secondMetaY,
      {
        width: colWidth,
      },
    );

    doc.text(
      `Maximum Marks: ${paper.maximumMarks}`,
      doc.page.margins.left + colWidth,
      secondMetaY,
      {
        width: colWidth,
        align: "right",
      },
    );

    doc.moveDown(1.2);

    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke();

    doc.moveDown(1);

    // Student Info
    doc.font("Helvetica-Bold").fontSize(12).text("Student Information");
    doc.moveDown(0.8);

    doc.font("Helvetica").fontSize(10);
    doc.text("Name: ________________________________", { continued: false });
    doc.moveDown(0.5);
    doc.text("Roll Number: __________________________");
    doc.moveDown(0.5);
    doc.text("Section: ______________________________");

    doc.moveDown(1.2);

    // Instructions
    doc.font("Helvetica-Bold").fontSize(12).text("General Instructions");
    doc.moveDown(0.6);

    doc.font("Helvetica").fontSize(10);

    paper.generalInstructions.forEach((instruction, index) => {
      doc.text(`${index + 1}. ${instruction}`, {
        width: pageWidth,
        lineGap: 3,
      });
    });

    doc.moveDown(1);

    // Sections
    paper.sections.forEach((section) => {
      if (doc.y > 690) {
        doc.addPage();
      }

      doc
        .font("Helvetica-Bold")
        .fontSize(13)
        .text(section.title, { underline: true });

      doc.moveDown(0.4);

      doc
        .font("Helvetica-Oblique")
        .fontSize(10)
        .text(section.instruction, {
          lineGap: 3,
        });

      doc.moveDown(0.8);

      section.questions.forEach((question, index) => {
        const numberWidth = 24;
        const questionX = doc.page.margins.left + numberWidth;
        const questionWidth = pageWidth - numberWidth;
        const questionText = question.question;

        doc.font("Helvetica").fontSize(10);
        const questionHeight = doc.heightOfString(questionText, {
          width: questionWidth,
          lineGap: 4,
        });

        ensureSpace(doc, questionHeight + 32);

        const questionStartY = doc.y;

        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor("#000000")
          .text(`${index + 1}.`, doc.page.margins.left, questionStartY, {
            width: numberWidth - 4,
          });

        doc.font("Helvetica").text(questionText, questionX, questionStartY, {
          width: questionWidth,
          lineGap: 4,
        });

        const afterQuestionY = doc.y;
        doc.y = afterQuestionY + 4;

        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor("#555555")
          .text(
            `Difficulty: ${formatDifficulty(question.difficulty)}   Marks: ${question.marks}`,
            questionX,
            doc.y,
            {
              width: questionWidth,
              lineGap: 2,
            },
          );

        doc.fillColor("#000000");
        doc.moveDown(0.7);
      });

      doc.moveDown(0.8);
    });

    // Page numbers
    const range = doc.bufferedPageRange();

    for (let i = range.start; i < range.start + range.count; i += 1) {
      doc.switchToPage(i);

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#777777")
        .text(
          `Page ${i + 1} of ${range.count}`,
          doc.page.margins.left,
          doc.page.height - 36,
          {
            align: "center",
            width: pageWidth,
          }
        );

      doc.fillColor("#000000");
    }

    doc.end();
  });
};
