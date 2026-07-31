"use client";

import { useEffect, useMemo, useState } from "react";
import { downloadTutorialPdf } from "./reportPdf";
function Image({ priority: _priority, ...props }: any) { return <img {...props} />; }

type Stage = {
  short: string;
  eyebrow: string;
  title: string;
  instruction: string;
  checks?: string[];
  code?: string;
  image?: "servo" | "selector" | "monitor";
  video?: boolean;
  question?: {
    text: string;
    options: string[];
    correct: number;
    correctFeedback?: string;
    incorrectFeedback?: string;
  };
};

const stages: Stage[] = [
  {
    short: "Prepare",
    eyebrow: "Step 1 · Before touching the board",
    title: "Get ready",
    instruction:
      "Before building, make sure your work area is ready. The board should stay disconnected from USB until the tutorial tells you to connect it.",
    checks: [
      "Confirm that your Freenove kit number matches the assigned kit.",
      "Have your computer, charger, Arduino IDE, and assigned document ready.",
      "Keep the Freenove board disconnected from USB.",
    ],
  },
  {
    short: "Meet Servo",
    eyebrow: "Step 2 · Introduction",
    title: "What is a servo motor?",
    instruction:
      "A servo is a small motor that can turn to a chosen position. In this project, Arduino will send the servo a signal that tells it what angle to move to.",
    video: true,
    question: {
      text: "What does Arduino tell the servo to do?",
      options: [
        "Move to a specific angle.",
        "Read the value from Pot1.",
        "Open the Serial Monitor.",
      ],
      correct: 0,
      correctFeedback: "Correct. Arduino sends a signal that tells the servo which angle to move to.",
      incorrectFeedback: "Not yet. Close this practice, read the explanation, and try again.",
    },
  },
  {
    short: "Connect",
    eyebrow: "Step 3 · Hardware",
    title: "Connect only the servo",
    instruction:
      "The servo has three wires: ground, power, and signal. Connect it to the three-pin connector for pin 3 while the board is disconnected. If the connector does not slide in easily, stop and ask for help.",
    checks: [
      "The board is disconnected from USB.",
      "The servo signal is connected to pin 3.",
      "The connector orientation is correct and secure.",
    ],
    image: "servo",
  },
  {
    short: "Set Pot1",
    eyebrow: "Step 4 · Input",
    title: "Set Pot1 to A1",
    instruction:
      "Pot1 is the knob already built into the Freenove Projects Board. Set it to A1 so Arduino can read the knob position.",
    checks: [
      "Pot1 is selected.",
      "Switch 1, labeled Pot1 and A1, is moved to the ON side.",
      "No unnecessary wires were added.",
    ],
    image: "selector",
  },
  {
    short: "Library",
    eyebrow: "Step 5 · Arduino IDE check",
    title: "Check the Servo library",
    instruction:
      "A library is extra code that gives Arduino new commands. The Servo library gives Arduino the commands needed to control a servo motor. Select Arduino Uno first, then check if the Servo example is already available.",
    checks: [
      "Open Tools → Board and select Arduino AVR Boards → Arduino Uno.",
      "Open File → Examples and look for Servo.",
      "If Servo appears, it is already available—do not reinstall it.",
      "If it is missing, open Tools → Manage Libraries… (or the Library Manager icon).",
      "Search for Servo, choose the official Servo library by Arduino, and select Install.",
    ],
  },
  {
    short: "Include",
    eyebrow: "Step 6 · Code piece 1",
    title: "Add the Servo library and object",
    instruction:
      "This first code piece loads the Servo library and creates a servo object named myServo. Type it at the top of your sketch.",
    code: `#include <Servo.h>\n\nServo myServo;`,
    question: {
      text: "What do these two lines add to the sketch?",
      options: [
        "They load the Servo library and create a Servo object named myServo.",
        "They read the potentiometer value from A1.",
        "They move the servo immediately to 180 degrees.",
      ],
      correct: 0,
    },
  },
  {
    short: "Pins",
    eyebrow: "Step 7 · Code piece 2",
    title: "Name the two pins",
    instruction:
      "These lines give simple names to the two pins. Pot1 uses A1 as the input. The servo uses pin 3 as the output.",
    code: `const int potPin = A1;\nconst int servoPin = 3;`,
    question: {
      text: "Which pin name represents the input and which represents the output?",
      options: [
        "potPin on A1 is the input, and servoPin on 3 is the output.",
        "servoPin on 3 is the input, and potPin on A1 is the output.",
        "Both pins are outputs because both are named with const int.",
      ],
      correct: 0,
    },
  },
  {
    short: "Setup",
    eyebrow: "Step 8 · Code piece 3",
    title: "Attach the servo",
    instruction:
      "setup() runs one time when Arduino starts. In this step, you tell Arduino that myServo is connected to servoPin.",
    code: `void setup() {\n  myServo.attach(servoPin);`,
    question: {
      text: "Why does attach() use servoPin inside setup()?",
      options: [
        "It tells the Servo object which physical pin controls the servo, and setup() runs once at the start.",
        "It reads the potentiometer repeatedly while the program runs.",
        "It prints the servo angle to the Serial Monitor.",
      ],
      correct: 0,
    },
  },
  {
    short: "Start Serial",
    eyebrow: "Step 9 · Code piece 4",
    title: "Start serial communication",
    instruction:
      "Serial Monitor lets you see values from the board on the computer. 9600 is the communication speed you will use later.",
    code: `  Serial.begin(9600);\n}`,
    question: {
      text: "What does 9600 represent in Serial.begin(9600)?",
      options: [
        "The baud rate, or communication speed, that must match the Serial Monitor.",
        "The maximum servo angle.",
        "The analog input pin number.",
      ],
      correct: 0,
    },
  },
  {
    short: "Read",
    eyebrow: "Step 10 · Code piece 5",
    title: "Read Pot1",
    instruction:
      "loop() repeats while the board is powered. This line reads the knob position from Pot1 and stores a number from 0 to 1023 in adcValue.",
    code: `void loop() {\n  int adcValue = analogRead(potPin);`,
    question: {
      text: "What range of values can adcValue store from analogRead(potPin)?",
      options: [
        "0 to 1023",
        "0 to 180",
        "3 to A1",
      ],
      correct: 0,
    },
  },
  {
    short: "Map",
    eyebrow: "Step 11 · Code piece 6",
    title: "Convert the value into an angle",
    instruction:
      "The knob reading goes from 0 to 1023. The servo angle goes from 0 to 180. map() changes the knob value into an angle; it does not move the servo yet.",
    code: `  int angle = map(adcValue, 0, 1023, 0, 180);`,
    question: {
      text: "What does map(adcValue, 0, 1023, 0, 180) do?",
      options: [
        "It converts the Pot1 reading range into a servo angle range.",
        "It installs the Servo library.",
        "It changes digital pin 3 into analog pin A1.",
      ],
      correct: 0,
    },
  },
  {
    short: "Move",
    eyebrow: "Step 12 · Code piece 7",
    title: "Move the servo",
    instruction:
      "Now the servo can move. This line sends the calculated angle from 0 to 180 to myServo instead of sending the original Pot1 value from 0 to 1023.",
    code: `  myServo.write(angle);`,
    question: {
      text: "Why does myServo.write() use angle instead of adcValue?",
      options: [
        "The servo expects an angle from 0 to 180, not a raw analog value from 0 to 1023.",
        "adcValue is the same thing as servoPin.",
        "The Servo library cannot use variables.",
      ],
      correct: 0,
    },
  },
  {
    short: "Print ADC",
    eyebrow: "Step 13 · Code piece 8",
    title: "Print the raw input",
    instruction:
      "Printing adcValue lets you see the original knob reading before it becomes a servo angle.",
    code: `  Serial.print("Potentiometer: ");\n  Serial.print(adcValue);`,
    question: {
      text: "Why is adcValue useful evidence in the Serial Monitor?",
      options: [
        "It shows the raw input value from Pot1 before it is mapped to an angle.",
        "It shows whether the Servo library is installed.",
        "It shows the USB port name.",
      ],
      correct: 0,
    },
  },
  {
    short: "Print Angle",
    eyebrow: "Step 14 · Code piece 9",
    title: "Print the mapped angle",
    instruction:
      "Printing angle lets you compare the knob reading with the angle sent to the servo. A short delay makes the Serial Monitor easier to read. One line may show Potentiometer: 512 | Servo angle: 90.",
    code: `  Serial.print(" | Servo angle: ");\n  Serial.println(angle);\n  delay(100);\n}`,
    question: {
      text: "What is the purpose of Serial.println(angle) and delay(100)?",
      options: [
        "println() prints the angle and moves to a new line; delay(100) slows the readings so they are easier to read.",
        "println() installs the library; delay(100) sets the board to Arduino Uno.",
        "println() moves the servo; delay(100) changes Pot1 to A1.",
      ],
      correct: 0,
    },
  },
  {
    short: "Complete Code",
    eyebrow: "Step 15 · Assemble your work",
    title: "Show your complete sketch",
    instruction:
      "Paste the complete program you built from the nine code pieces. Check your own work before uploading it.",
    checks: [
      "The Servo library, Servo object, and both pin names are present.",
      "setup() attaches the servo and starts serial communication.",
      "loop() reads Pot1, maps the value, and moves the servo.",
      "The ADC value and mapped angle are printed to the Serial Monitor.",
      "All parentheses, semicolons, and closing braces are present.",
    ],
  },
  {
    short: "Upload",
    eyebrow: "Step 16 · Arduino IDE",
    title: "Verify and upload",
    instruction:
      "Connect the USB cable. Select the correct board and port, then verify and upload the sketch. If verification fails, compare your sketch with the code pieces one step at a time.",
    checks: [
      "The correct board is selected.",
      "The correct port is selected.",
      "The sketch verifies without errors.",
      "The sketch uploads successfully.",
    ],
  },
  {
    short: "Monitor",
    eyebrow: "Step 17 · Make the mapping visible",
    title: "Open and read the Serial Monitor",
    instruction:
      "Open Serial Monitor after the upload. Turn Pot1 slowly and watch how the knob value changes with the servo angle. A middle knob value near 512 should produce an angle near 90 degrees.",
    checks: [
      "The Serial Monitor is open.",
      "The baud rate is set to 9600.",
      "Each line displays a potentiometer value and servo angle.",
      "As the potentiometer value increases, the mapped angle also increases.",
    ],
    image: "monitor",
    question: {
      text: "What angle should an ADC value near 512 produce?",
      options: [
        "About 90 degrees",
        "About 0 degrees",
        "About 180 degrees",
      ],
      correct: 0,
    },
  },
  {
    short: "Test",
    eyebrow: "Step 18 · Evidence",
    title: "Complete three controlled tests",
    instruction:
      "Test the system in three positions: low, middle, and high. Use real values from the Serial Monitor. As Pot1 increases, the ADC value and servo angle should also increase.",
    checks: [
      "Low position: record ADC value, calculated angle, and observed position.",
      "Middle position: record ADC value, calculated angle, and observed position.",
      "High position: record ADC value, calculated angle, and observed position.",
      "Confirm that the servo movement matches the recorded values.",
    ],
    question: {
      text: "What relationship should your three tests show?",
      options: [
        "As Pot1 increases, the ADC value increases and the mapped servo angle increases.",
        "As Pot1 increases, the ADC value always stays at 0.",
        "The servo angle changes randomly and does not depend on Pot1.",
      ],
      correct: 0,
    },
  },
  {
    short: "Explain",
    eyebrow: "Step 19 · English explanation",
    title: "Prepare your explanation",
    instruction:
      "Prepare a short explanation in your own words. Focus on what enters the system, what Arduino does, and what moves at the end.",
    checks: [
      "Identify Pot1 on A1 as the input.",
      "Explain that analogRead produces a value from 0 to 1023.",
      "Explain that map converts the value to an angle from 0° to 180°.",
      "Identify the servo on pin 3 as the output.",
      "Use at least three vocabulary words correctly.",
    ],
    question: {
      text: "Which explanation correctly describes the project?",
      options: [
        "Pot1 is the input, Arduino reads its analog value, maps it to an angle, and sends a signal to the servo output on pin 3.",
        "The servo is the input, Arduino maps pin 3 to A1, and Pot1 prints the Serial Monitor.",
        "The USB cable controls the angle directly without Arduino using the sketch.",
      ],
      correct: 0,
    },
  },
  {
    short: "Submit",
    eyebrow: "Step 20 · Final check",
    title: "Save, demonstrate, and submit",
    instruction:
      "Before asking for evaluation, make sure your code, test evidence, demonstration, and workspace are ready.",
    checks: [
      "Group members, group, and date are complete.",
      "The final Arduino sketch is saved with the assigned filename.",
      "All three test results and the observation are complete.",
      "The live demonstration and English explanation are ready.",
      "The workspace is organized and all equipment will be returned correctly.",
    ],
  },
];

function shuffledIndices(length: number) {
  const indices = Array.from({ length }, (_, index) => index);
  for (let index = indices.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [indices[index], indices[randomIndex]] = [indices[randomIndex], indices[index]];
  }
  return indices;
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [current, setCurrent] = useState(0);
  const [confirmed, setConfirmed] = useState<boolean[]>(
    () => stages.map(() => false),
  );
  const [copied, setCopied] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [optionOrders] = useState(() =>
    stages.map((item) =>
      item.question ? shuffledIndices(item.question.options.length) : [],
    ),
  );
  const [studentInfo, setStudentInfo] = useState({
    members: "",
    group: "",
    date: "",
  });
  const [finalSketch, setFinalSketch] = useState("");

  /* Restore the device-local tutorial session once after hydration. */
  useEffect(() => {
    const saved = window.localStorage.getItem("servo-guided-v4");
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      // This hydration-only effect intentionally restores several related fields.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStarted(Boolean(data.started));
      setCurrent(Math.min(Number(data.current) || 0, stages.length - 1));
      if (Array.isArray(data.confirmed) && data.confirmed.length === stages.length) {
        setConfirmed(data.confirmed.map(Boolean));
      }
      if (data.quizAnswers && typeof data.quizAnswers === "object") {
        setQuizAnswers(data.quizAnswers);
      }
      if (data.studentInfo && typeof data.studentInfo === "object") {
        setStudentInfo({
          members: String(data.studentInfo.members || data.studentInfo.fullName || ""),
          group: String(data.studentInfo.group || ""),
          date: String(data.studentInfo.date || ""),
        });
      }
      setFinalSketch(String(data.finalSketch || ""));
    } catch {
      window.localStorage.removeItem("servo-guided-v4");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "servo-guided-v4",
      JSON.stringify({
        started,
        current,
        confirmed,
        quizAnswers,
        studentInfo,
        finalSketch,
      }),
    );
  }, [started, current, confirmed, quizAnswers, studentInfo, finalSketch]);

  useEffect(() => {
    if (!practiceOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPracticeOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [practiceOpen]);

  const stage = stages[current];
  const quizCorrect =
    !stage.question || quizAnswers[current] === stage.question.correct;
  const studentInfoComplete =
    current !== 0 ||
    Boolean(
      studentInfo.members.trim() &&
      studentInfo.group.trim() &&
      studentInfo.date,
    );
  const finalCodeStage = stage.short === "Complete Code";
  const finalSketchComplete = !finalCodeStage || Boolean(finalSketch.trim());
  const canConfirm =
    studentInfoComplete &&
    finalSketchComplete;
  const progress = useMemo(
    () => Math.round((confirmed.filter(Boolean).length / stages.length) * 100),
    [confirmed],
  );

  function setStageConfirmed(value: boolean) {
    setConfirmed((items) =>
      items.map((item, index) => (index === current ? value : item)),
    );
  }

  async function copyPiece() {
    if (!stage.code) return;
    await navigator.clipboard?.writeText(stage.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function selectedAnswer(index: number) {
    const question = stages[index].question;
    const answerIndex = quizAnswers[index];
    if (!question || answerIndex === undefined) return "Not answered";
    return question.options[answerIndex] || "Not answered";
  }

  function openReport() {
    setPracticeOpen(false);
    setShowReport(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function downloadReportPdf() {
    setPdfDownloading(true);
    try {
      await downloadTutorialPdf({
        confirmed,
        date: studentInfo.date,
        finalSketch,
        group: studentInfo.group,
        members: studentInfo.members,
        progress,
        quizAnswers,
        stages,
      });
    } catch (error) {
      console.error(error);
      window.alert("The PDF could not be created. Please try again.");
    } finally {
      setPdfDownloading(false);
    }
  }

  function next() {
    if (!confirmed[current]) return;
    setPracticeOpen(false);
    setCurrent((value) => Math.min(value + 1, stages.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setPracticeOpen(false);
    if (current === 0) {
      setStarted(false);
    } else {
      setCurrent((value) => value - 1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToCompletedStage(index: number) {
    if (!confirmed[index] || index === current) return;
    setPracticeOpen(false);
    setCurrent(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (showReport) {
    return (
      <main className="app-shell report-shell">
        <header className="topbar report-topbar">
          <div className="brand">
            <span className="brand-mark">AID</span>
            <span><b>Servo Tutorial Report</b><small>Summative #4</small></span>
          </div>
          <button
            className="report-toolbar-button report-back-button"
            onClick={() => setShowReport(false)}
            type="button"
          >
            <span aria-hidden="true">←</span> Back to tutorial
          </button>
        </header>

        <section className="report-page">
          <div className="report-actions">
            <button
              className="report-toolbar-button report-download-button"
              disabled={pdfDownloading}
              onClick={downloadReportPdf}
              type="button"
            >
              <span aria-hidden="true">↓</span>
              {pdfDownloading ? "Creating PDF..." : "Download PDF"}
            </button>
          </div>

          <article className="report-document">
            <header className="report-heading">
              <p>Academia Internacional David · Technology & Robotics</p>
              <h1>Freenove Servo Tutorial Report</h1>
              <dl>
                <div><dt>Members</dt><dd>{studentInfo.members || "Not entered"}</dd></div>
                <div><dt>Group</dt><dd>{studentInfo.group || "Not entered"}</dd></div>
                <div><dt>Date</dt><dd>{studentInfo.date || "Not entered"}</dd></div>
                <div><dt>Progress</dt><dd>{progress}% complete</dd></div>
              </dl>
            </header>

            <section className="report-section">
              <h2>Full Tutorial Record</h2>
              <ol className="report-steps">
                {stages.map((item, index) => (
                  <li key={item.short}>
                    <div className="report-step-heading">
                      <span className={confirmed[index] ? "complete" : "incomplete"}>
                        {confirmed[index] ? "Complete" : "Incomplete"}
                      </span>
                      <b>Step {index + 1}: {item.title}</b>
                    </div>
                    <p><b>Context:</b> {item.instruction}</p>
                    {item.checks && (
                      <ul>
                        {item.checks.map((check) => <li key={check}>{check}</li>)}
                      </ul>
                    )}
                    {item.code && <pre className="report-code small">{item.code}</pre>}
                    {item.question && (
                      <p><b>Practice answer:</b> {selectedAnswer(index)}</p>
                    )}
                  </li>
                ))}
              </ol>
            </section>

            <section className="report-section">
              <h2>Complete Arduino Sketch</h2>
              <pre className="report-code">{finalSketch || "No sketch pasted yet."}</pre>
            </section>
          </article>
        </section>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="app-shell">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">AID</span>
            <span><b>Academia Internacional David</b><small>Technology & Robotics</small></span>
          </div>
          <div className="header-meta">
            <span className="grade-chip">Grade 8</span>
            <span className="points-chip">★ 40 points</span>
          </div>
        </header>
        <section className="welcome">
          <div className="welcome-copy">
            <p className="kicker">Summative #4 · Guided tutorial</p>
            <h1>Build your servo system<br />one stage at a time.</h1>
            <p>
              You will see only the instruction you need now. Complete it,
              follow one clear step, try the practice, and continue when your work is ready.
            </p>
            <div className="welcome-rules">
              <span><b>20</b> focused stages</span>
              <span><b>9</b> separate code pieces</span>
              <span><b>1</b> final working sketch</span>
            </div>
            <button className="primary-cta" onClick={() => setStarted(true)} type="button">
              {confirmed.some(Boolean) ? "Continue tutorial" : "Begin with Prepare"} <span>→</span>
            </button>
          </div>
          <div className="hero-visual">
            <div className="hero-components">
              <figure>
                <Image
                  alt="Potentiometer used as the Pot1 input"
                  height={700}
                  priority
                  src="assets/potentiometer.png"
                  width={700}
                />
                <figcaption>Pot1 · Input A1</figcaption>
              </figure>
              <div className="component-flow" aria-hidden="true">
                <span>Arduino changes the value</span>
                <b>→</b>
              </div>
              <figure>
                <Image
                  alt="Blue SG90 servo motor used as the output"
                  height={300}
                  priority
                  src="assets/sg90-servo.png"
                  width={400}
                />
                <figcaption>Servo · Output pin 3</figcaption>
              </figure>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">AID</span>
          <span><b>Servo Tutorial</b><small>Summative #4</small></span>
        </div>
        <div className="header-progress">
          <span>{progress}% complete</span>
          <div><i style={{ width: `${progress}%` }} /></div>
        </div>
      </header>

      <div className="stage-strip" aria-label="Tutorial progress">
        {stages.map((item, index) => (
          <button
            aria-current={index === current ? "step" : undefined}
            className={[
              index === current ? "current" : "",
              confirmed[index] ? "complete" : "",
              index > current && !confirmed[index] ? "future" : "",
            ].join(" ")}
            disabled={!confirmed[index] || index === current}
            key={item.short}
            onClick={() => goToCompletedStage(index)}
            title={
              index === current
                ? "Current step"
                : confirmed[index]
                  ? `Go to step ${index + 1}: ${item.short}`
                  : "Not completed yet"
            }
            type="button"
          >
            <span>{confirmed[index] ? "✓" : index + 1}</span>
            <b>{index === current ? item.short : ""}</b>
          </button>
        ))}
      </div>

      <section className="stage-page">
        <article className="focus-card">
          <div className="stage-count">
            Step {current + 1} of {stages.length} · {stage.eyebrow.split(" · ")[1]}
          </div>
          <h1>{stage.title}</h1>
          <section className="context-box" aria-label="Step explanation">
            <span>{stage.code || stage.question || stage.video ? "Understand this" : "Your task"}</span>
            <p>{stage.instruction}</p>
          </section>

          {current === 0 && (
            <div className="student-info" aria-label="Group information">
              <label>
                <span>Members</span>
                <input
                  onChange={(event) =>
                    setStudentInfo((info) => ({ ...info, members: event.target.value }))
                  }
                  placeholder="Enter all group members"
                  type="text"
                  value={studentInfo.members}
                />
              </label>
              <label>
                <span>Group</span>
                <input
                  onChange={(event) =>
                    setStudentInfo((info) => ({ ...info, group: event.target.value }))
                  }
                  placeholder="Example: 8A"
                  type="text"
                  value={studentInfo.group}
                />
              </label>
              <label>
                <span>Date</span>
                <input
                  onChange={(event) =>
                    setStudentInfo((info) => ({ ...info, date: event.target.value }))
                  }
                  type="date"
                  value={studentInfo.date}
                />
              </label>
            </div>
          )}

          {stage.video && (
            <div className="video-lesson">
              <div className="video-frame">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  src="https://www.youtube-nocookie.com/embed/tHOH-bYjR4k?start=0&end=72&rel=0"
                  title="Servo motor introduction — required section from 0:00 to 1:12"
                />
              </div>
              <p><b>Required viewing:</b> 0:00–1:12</p>
            </div>
          )}

          {stage.image && (
            <div className="connection-visual">
              {stage.image === "selector" ? (
                <>
                  <Image
                    alt="Freenove manual selector diagram showing switch 1 for Pot1 and A1 moved to ON"
                    className="selector-image"
                    height={330}
                    src="assets/pot1-a1-selector-manual.svg"
                    width={360}
                  />
                  <p className="manual-caption">
                    From the Freenove manual: move selector <b>1</b> (Pot1 / A1) toward <b>ON</b>.
                  </p>
                </>
              ) : stage.image === "monitor" ? (
                <div className="monitor-reference-list">
                  <figure>
                    <Image
                      alt="Serial Monitor button in Arduino IDE"
                      height={180}
                      src="assets/serial-monitor-button.png"
                      width={620}
                    />
                    <figcaption>1. Select the Serial Monitor button in Arduino IDE.</figcaption>
                  </figure>
                  <figure>
                    <Image
                      alt="Arduino Serial Monitor showing potentiometer values, servo angles, and 9600 baud"
                      height={754}
                      src="assets/serial-monitor-output.png"
                      width={2864}
                    />
                    <figcaption>2. Set 9600 baud and check that both values appear.</figcaption>
                  </figure>
                </div>
              ) : (
                <div className="connection-reference-list">
                  <figure>
                    <Image
                      alt="Servo connector labeled GND, VCC, and SIGNAL"
                      height={422}
                      src="assets/servo-connections.png"
                      width={750}
                    />
                    <figcaption>1. Identify GND, VCC, and SIGNAL on the servo connector.</figcaption>
                  </figure>
                  <figure>
                    <Image
                      alt="Servo connected to the pin 3 header on a Freenove Projects Board"
                      height={526}
                      src="assets/freenove-servo-connection.png"
                      width={702}
                    />
                    <figcaption>2. Connect the servo to the pin 3 header as shown.</figcaption>
                  </figure>
                </div>
              )}
            </div>
          )}

          {stage.code && (
            <div className="code-piece">
              <div className="code-piece-head">
                <span>Copy this code · Piece {stages.slice(0, current + 1).filter((item) => item.code).length} of 9</span>
                <button onClick={copyPiece} type="button">{copied ? "✓ Copied" : "Copy"}</button>
              </div>
              <pre><code>{stage.code}</code></pre>
              <p>Type this below the code from the previous step in Arduino IDE. Do not replace your sketch.</p>
            </div>
          )}

          {finalCodeStage && (
            <label className="response-field code-workspace">
              <span>Your complete Arduino sketch</span>
              <small>Paste the complete code you assembled from all nine pieces. Review it before continuing.</small>
              <textarea
                onChange={(event) => setFinalSketch(event.target.value)}
                placeholder="Paste your complete Arduino sketch here…"
                spellCheck={false}
                value={finalSketch}
              />
            </label>
          )}

          {stage.checks && (
            <div className="task-list">
              <h2>Do this</h2>
              {stage.checks.map((check, index) => (
                <div key={check}><span>{index + 1}</span><p>{check}</p></div>
              ))}
            </div>
          )}

          {stage.question && (
            <div className="practice-launch">
              <button onClick={() => setPracticeOpen(true)} type="button">
                Practice question
              </button>
              <span>{quizAnswers[current] === undefined ? "Optional" : "Answer saved"}</span>
            </div>
          )}

          <label className="confirmation">
            <input
              checked={confirmed[current]}
              disabled={!canConfirm}
              onChange={(event) => setStageConfirmed(event.target.checked)}
              type="checkbox"
            />
            <span>
              <b>I completed this step.</b>
              <small>
                {!studentInfoComplete
                  ? "Enter the group members, group, and date to unlock this confirmation."
                  : !finalSketchComplete
                    ? "Paste your complete assembled Arduino sketch to unlock this confirmation."
                    : "I can show or explain the required work."}
              </small>
            </span>
          </label>
        </article>

        <nav className="stage-actions" aria-label="Stage navigation">
          <button className="back-button" onClick={back} type="button">← Back</button>
          {current < stages.length - 1 ? (
            <button className="next-button" disabled={!confirmed[current]} onClick={next} type="button">
              Next: {stages[current + 1].short} →
            </button>
          ) : (
            <button className="next-button" disabled={!confirmed[current]} onClick={openReport} type="button">
              View full report
            </button>
          )}
        </nav>
        {!confirmed[current] && <p className="unlock-note">Confirm the step above to unlock Next.</p>}
      </section>

      {practiceOpen && stage.question && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPracticeOpen(false);
          }}
          role="presentation"
        >
          <section
            aria-labelledby="practice-question-title"
            aria-modal="true"
            className="practice-modal"
            role="dialog"
          >
            <button
              aria-label="Close practice question"
              autoFocus
              className="modal-close"
              onClick={() => setPracticeOpen(false)}
              type="button"
            >
              ×
            </button>
            <span className="practice-label">Optional practice</span>
            <h2 id="practice-question-title">{stage.question.text}</h2>
            <div className="quiz-options">
              {optionOrders[current].map((optionIndex, displayIndex) => (
                <button
                  aria-pressed={quizAnswers[current] === optionIndex}
                  className={quizAnswers[current] === optionIndex ? "selected" : ""}
                  key={stage.question!.options[optionIndex]}
                  onClick={() =>
                    setQuizAnswers((answers) => ({ ...answers, [current]: optionIndex }))
                  }
                  type="button"
                >
                  <span>{String.fromCharCode(65 + displayIndex)}</span>
                  {stage.question!.options[optionIndex]}
                </button>
              ))}
            </div>
            {quizAnswers[current] !== undefined && (
              <p className={quizCorrect ? "quiz-correct" : "quiz-incorrect"} role="status">
                {quizCorrect
                  ? stage.question.correctFeedback || "Correct. This matches the explanation."
                  : stage.question.incorrectFeedback || "Close this practice, read the explanation, and try again."}
              </p>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
