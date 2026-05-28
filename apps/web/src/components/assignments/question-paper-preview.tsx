import { QuestionPaper } from "../../types/assignment";
import { DifficultyBadge } from "../../components/ui/difficulty-badge";

interface QuestionPaperPreviewProps {
  paper: QuestionPaper;
}

export function QuestionPaperPreview({ paper }: QuestionPaperPreviewProps) {
  return (
    <div className="mx-auto max-w-[980px] rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.08)] lg:p-10">
      <div className="font-inter">
        <header className="border-b border-[#dadada] pb-6 text-center">
          <h1 className="text-2xl font-bold uppercase tracking-wide text-[#303030]">
            {paper.schoolName}
          </h1>

          <p className="mt-2 text-base font-semibold text-[#5E5E5E]">
            Question Paper
          </p>

          <div className="mt-5 grid gap-3 text-left text-sm text-[#303030] md:grid-cols-4">
            <div className="rounded-[14px] bg-[#f6f6f6] px-4 py-3">
              <p className="text-xs font-semibold uppercase text-[#5E5E5E]">
                Subject
              </p>
              <p className="mt-1 font-bold">{paper.subject}</p>
            </div>

            <div className="rounded-[14px] bg-[#f6f6f6] px-4 py-3">
              <p className="text-xs font-semibold uppercase text-[#5E5E5E]">
                Class
              </p>
              <p className="mt-1 font-bold">{paper.className}</p>
            </div>

            <div className="rounded-[14px] bg-[#f6f6f6] px-4 py-3">
              <p className="text-xs font-semibold uppercase text-[#5E5E5E]">
                Time
              </p>
              <p className="mt-1 font-bold">{paper.timeAllowed}</p>
            </div>

            <div className="rounded-[14px] bg-[#f6f6f6] px-4 py-3">
              <p className="text-xs font-semibold uppercase text-[#5E5E5E]">
                Max Marks
              </p>
              <p className="mt-1 font-bold">{paper.maximumMarks}</p>
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-[20px] border border-[#dadada] p-5">
          <h2 className="text-base font-bold text-[#303030]">
            Student Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-[#5E5E5E]">Name</p>
              <div className="mt-4 border-b border-[#303030]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#5E5E5E]">
                Roll Number
              </p>
              <div className="mt-4 border-b border-[#303030]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#5E5E5E]">Section</p>
              <div className="mt-4 border-b border-[#303030]" />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[20px] bg-[#f6f6f6] p-5">
          <h2 className="text-base font-bold text-[#303030]">
            General Instructions
          </h2>

          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-[#303030]">
            {paper.generalInstructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </section>

        <main className="mt-8 space-y-8">
          {paper.sections.map((section, sectionIndex) => (
            <section
              key={`${section.title}-${sectionIndex}`}
              className="rounded-[24px] border border-[#dadada] p-5"
            >
              <div className="flex flex-col gap-3 border-b border-[#dadada] pb-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#303030]">
                    {section.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#5E5E5E]">
                    {section.instruction}
                  </p>
                </div>

                <span className="rounded-full bg-[#181818] px-4 py-2 text-xs font-bold text-white">
                  {section.questions.length} Questions
                </span>
              </div>

              <div className="mt-5 space-y-5">
                {section.questions.map((question, questionIndex) => (
                  <article
                    key={question.id}
                    className="rounded-[18px] bg-[#fafafa] p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#303030]">
                          {questionIndex + 1}
                        </span>

                        <div className="min-w-0">
                          <p className="text-[15px] leading-7 text-[#303030]">
                            {question.question}
                          </p>

                          {question.options?.length ? (
                            <ol className="mt-3 grid gap-2 text-sm leading-6 text-[#303030] sm:grid-cols-2">
                              {question.options.map((option, optionIndex) => (
                                <li
                                  key={`${question.id}-option-${optionIndex}`}
                                  className="rounded-[12px] bg-white px-3 py-2"
                                >
                                  <span className="font-bold">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>{" "}
                                  {option}
                                </li>
                              ))}
                            </ol>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 md:justify-end">
                        <DifficultyBadge difficulty={question.difficulty} />

                        <span className="inline-flex h-7 items-center rounded-full bg-white px-3 text-xs font-bold text-[#303030]">
                          {question.marks} Mark
                          {question.marks > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
