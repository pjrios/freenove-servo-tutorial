type ReportStage = {
  title: string;
  instruction: string;
  checks?: string[];
  code?: string;
  question?: {
    options: string[];
  };
};

type TutorialReport = {
  members: string;
  group: string;
  date: string;
  progress: number;
  stages: ReportStage[];
  confirmed: boolean[];
  quizAnswers: Record<number, number>;
  finalSketch: string;
};

function asciiText(value: string) {
  return value
    .replaceAll("→", "->")
    .replaceAll("°", " degrees")
    .replaceAll("…", "...")
    .replaceAll("—", "-")
    .replaceAll("–", "-")
    .replaceAll("’", "'")
    .replaceAll("“", '"')
    .replaceAll("”", '"')
    .replaceAll("·", "-");
}

export async function buildTutorialPdf(report: TutorialReport) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ format: "a4", unit: "pt" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;
  const bottomLimit = pageHeight - 52;
  let y = margin;

  pdf.setProperties({
    author: "Academia Internacional David",
    subject: "Freenove Servo Tutorial",
    title: "Freenove Servo Tutorial Report",
  });

  function startNewPage() {
    pdf.addPage();
    y = margin;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(10, 95, 125);
    pdf.text("FREENOVE SERVO TUTORIAL REPORT", margin, y);
    pdf.setDrawColor(214, 226, 236);
    pdf.line(margin, y + 8, pageWidth - margin, y + 8);
    y += 28;
  }

  function ensureSpace(height: number) {
    if (y + height > bottomLimit) startNewPage();
  }

  function wrappedLines(text: string, width: number, fontSize = 10) {
    pdf.setFontSize(fontSize);
    return pdf.splitTextToSize(asciiText(text), width) as string[];
  }

  function writeWrapped(
    text: string,
    options: {
      font?: "helvetica" | "courier";
      style?: "normal" | "bold";
      size?: number;
      color?: [number, number, number];
      indent?: number;
      lineHeight?: number;
      spacingAfter?: number;
    } = {},
  ) {
    const font = options.font || "helvetica";
    const style = options.style || "normal";
    const size = options.size || 10;
    const color = options.color || [9, 33, 63];
    const indent = options.indent || 0;
    const lineHeight = options.lineHeight || size * 1.38;
    const lines = wrappedLines(text, contentWidth - indent, size);

    pdf.setFont(font, style);
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    lines.forEach((line) => {
      ensureSpace(lineHeight);
      pdf.text(line, margin + indent, y);
      y += lineHeight;
    });
    y += options.spacingAfter ?? 4;
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(10, 95, 125);
  pdf.text("ACADEMIA INTERNACIONAL DAVID - TECHNOLOGY & ROBOTICS", margin, y);
  y += 24;
  pdf.setFontSize(22);
  pdf.setTextColor(9, 33, 63);
  pdf.text("Freenove Servo Tutorial Report", margin, y);
  y += 28;

  const members = asciiText(report.members.trim() || "Not entered");
  const memberLines = wrappedLines(members, contentWidth - 20, 10);
  const memberHeight = Math.max(48, 24 + memberLines.length * 13);
  pdf.setFillColor(245, 249, 252);
  pdf.setDrawColor(214, 226, 236);
  pdf.roundedRect(margin, y, contentWidth, memberHeight, 5, 5, "FD");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(92, 108, 128);
  pdf.text("MEMBERS", margin + 10, y + 14);
  pdf.setFontSize(10);
  pdf.setTextColor(9, 33, 63);
  memberLines.forEach((line, index) => pdf.text(line, margin + 10, y + 29 + index * 13));
  y += memberHeight + 8;

  const details = [
    ["GROUP", report.group.trim() || "Not entered"],
    ["DATE", report.date || "Not entered"],
    ["PROGRESS", `${report.progress}% complete`],
  ];
  const detailGap = 8;
  const detailWidth = (contentWidth - detailGap * 2) / 3;
  details.forEach(([label, value], index) => {
    const x = margin + index * (detailWidth + detailGap);
    pdf.setFillColor(245, 249, 252);
    pdf.roundedRect(x, y, detailWidth, 44, 5, 5, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(92, 108, 128);
    pdf.text(label, x + 9, y + 14);
    pdf.setFontSize(10);
    pdf.setTextColor(9, 33, 63);
    pdf.text(asciiText(value), x + 9, y + 30);
  });
  y += 68;

  writeWrapped("Full Tutorial Record", { size: 15, style: "bold", spacingAfter: 10 });

  report.stages.forEach((stage, index) => {
    const estimatedHeight =
      36 +
      wrappedLines(stage.instruction, contentWidth, 9.5).length * 13.5 +
      (stage.checks || []).reduce(
        (height, check) => height + wrappedLines(`- ${check}`, contentWidth - 10, 9).length * 12.5,
        0,
      ) +
      (stage.code ? asciiText(stage.code).split("\n").length * 11.5 + 10 : 0) +
      (stage.question ? 24 : 0) +
      18;
    const availablePageHeight = bottomLimit - margin - 28;
    if (estimatedHeight < availablePageHeight && y + estimatedHeight > bottomLimit) {
      startNewPage();
    }
    ensureSpace(58);
    const complete = Boolean(report.confirmed[index]);
    pdf.setFillColor(complete ? 228 : 255, complete ? 247 : 240, complete ? 236 : 238);
    pdf.setTextColor(complete ? 17 : 163, complete ? 107 : 52, complete ? 66 : 41);
    pdf.roundedRect(margin, y - 9, 58, 17, 4, 4, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.text(complete ? "COMPLETE" : "INCOMPLETE", margin + 6, y + 2);

    const titleLines = wrappedLines(`Step ${index + 1}: ${stage.title}`, contentWidth - 70, 11);
    pdf.setFontSize(11);
    pdf.setTextColor(9, 33, 63);
    titleLines.forEach((line, titleIndex) => {
      if (titleIndex > 0) ensureSpace(15);
      pdf.text(line, margin + 70, y + titleIndex * 15);
    });
    y += Math.max(24, titleLines.length * 15 + 6);

    writeWrapped(`Context: ${stage.instruction}`, { size: 9.5, lineHeight: 13.5, spacingAfter: 5 });

    stage.checks?.forEach((check) => {
      writeWrapped(`- ${check}`, { indent: 10, size: 9, lineHeight: 12.5, spacingAfter: 1 });
    });

    if (stage.code) {
      y += 3;
      writeWrapped(stage.code, {
        color: [36, 52, 66],
        font: "courier",
        lineHeight: 11.5,
        size: 8.5,
        spacingAfter: 5,
      });
    }

    if (stage.question) {
      const answerIndex = report.quizAnswers[index];
      const answer = answerIndex === undefined
        ? "Not answered"
        : stage.question.options[answerIndex] || "Not answered";
      writeWrapped(`Practice answer: ${answer}`, { size: 9, style: "bold", lineHeight: 12.5 });
    }

    pdf.setDrawColor(225, 233, 240);
    ensureSpace(12);
    pdf.line(margin, y + 1, pageWidth - margin, y + 1);
    y += 14;
  });

  ensureSpace(54);
  writeWrapped("Complete Arduino Sketch", { size: 15, style: "bold", spacingAfter: 10 });
  writeWrapped(report.finalSketch.trim() || "No sketch pasted yet.", {
    color: [36, 52, 66],
    font: "courier",
    lineHeight: 11.5,
    size: 8.5,
    spacingAfter: 0,
  });

  const pageCount = pdf.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    pdf.setPage(page);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(92, 108, 128);
    pdf.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 24, { align: "right" });
  }

  return pdf;
}

export async function downloadTutorialPdf(report: TutorialReport) {
  const pdf = await buildTutorialPdf(report);
  const groupName = report.group.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  const suffix = [groupName, report.date].filter(Boolean).join("-");
  pdf.save(`servo-tutorial-report${suffix ? `-${suffix}` : ""}.pdf`);
}
