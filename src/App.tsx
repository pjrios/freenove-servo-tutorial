"use client";

import { useEffect, useMemo, useState } from "react";
function Image({ priority: _priority, ...props }: any) { return <img {...props} />; }

type Stage = {
  short: string;
  eyebrow: string;
  title: string;
  instruction: string;
  checks?: string[];
  code?: string;
  tip?: string;
  image?: "connection" | "selector";
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
    tip: "This step prevents connection mistakes before the board has power.",
  },
  {
    short: "Meet Servo",
    eyebrow: "Step 2 · Introduction",
    title: "What is a servo motor?",
    instruction:
      "A servo is a small motor that can turn to a chosen position. In this project, Arduino will send the servo a signal that tells it what angle to move to.",
    video: true,
    question: {
      text: "What makes a servo different from a basic DC motor?",
      options: [
        "It receives a signal telling it to move to a specific angle.",
        "It can only rotate continuously.",
        "It does not use electrical energy.",
      ],
      correct: 0,
      correctFeedback: "Correct. The signal tells the servo which angle to move to.",
      incorrectFeedback: "Review the context above, then try again.",
    },
    tip: "The practice question helps you check your understanding, but it does not block the next step.",
  },
  {
    short: "Connect",
    eyebrow: "Step 3 · Hardware",
    title: "Connect only the servo",
    instruction:
      "The servo has three wires: ground, power, and signal. Connect it to the three-pin servo connector for pin 3 while the board is still disconnected.",
    checks: [
      "The board is disconnected from USB.",
      "The servo signal is connected to pin 3.",
      "The connector orientation is correct and secure.",
    ],
    tip: "If it does not slide in easily, stop and ask for help.",
    image: "connection",
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
    tip: "Pot1 will be the input. The servo will be the output.",
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
    tip: "When your sketch later uses #include <Servo.h>, it is asking Arduino IDE to load the Servo library.",
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
    tip: "The library gives Arduino the instructions needed to control a servo.",
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
    tip: "const means these pin numbers will not change while the program runs.",
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
    tip: "This tells the Servo object which physical signal pin it controls.",
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
    tip: "9600 is the baud rate—the communication speed used by both the board and Serial Monitor.",
  },
  {
    short: "Read",
    eyebrow: "Step 10 · Code piece 5",
    title: "Read Pot1",
    instruction:
      "loop() repeats while the board is powered. This line reads the knob position from Pot1 and stores it in adcValue.",
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
    tip: "Remember the Arduino analog range: 0 to 1023.",
  },
  {
    short: "Map",
    eyebrow: "Step 11 · Code piece 6",
    title: "Convert the value into an angle",
    instruction:
      "The knob reading goes from 0 to 1023. The servo angle goes from 0 to 180. map() changes the knob value into an angle.",
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
    tip: "map() converts the input scale; it does not move the servo by itself.",
  },
  {
    short: "Move",
    eyebrow: "Step 12 · Code piece 7",
    title: "Move the servo",
    instruction:
      "Now the servo can move. This line sends the calculated angle to myServo.",
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
    tip: "The servo expects an angle, not a raw analog value from 0 to 1023.",
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
    tip: "This lets you see the actual input value from 0 to 1023.",
  },
  {
    short: "Print Angle",
    eyebrow: "Step 14 · Code piece 9",
    title: "Print the mapped angle",
    instruction:
      "Printing angle lets you compare the knob reading with the angle sent to the servo. A short delay makes the Serial Monitor easier to read.",
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
    tip: "Each line will now show one input–output pair, such as Potentiometer: 512 | Servo angle: 90.",
  },
  {
    short: "Complete Code",
    eyebrow: "Step 15 · Assemble your work",
    title: "Show your complete sketch",
    instruction:
      "You have now built the sketch one piece at a time. Paste the complete program here so you can review it before uploading.",
    checks: [
      "The Servo library, Servo object, and both pin names are present.",
      "setup() attaches the servo and starts serial communication.",
      "loop() reads Pot1, maps the value, and moves the servo.",
      "The ADC value and mapped angle are printed to the Serial Monitor.",
      "All parentheses, semicolons, and closing braces are present.",
    ],
    tip: "Do not replace your work with code from another source. This field should show the program you built one piece at a time.",
  },
  {
    short: "Upload",
    eyebrow: "Step 16 · Arduino IDE",
    title: "Verify and upload",
    instruction:
      "Now connect the USB cable. Select the correct board and port, then verify and upload the sketch.",
    checks: [
      "The correct board is selected.",
      "The correct port is selected.",
      "The sketch verifies without errors.",
      "The sketch uploads successfully.",
    ],
    tip: "If verification fails, compare your sketch with each code piece one stage at a time.",
  },
  {
    short: "Monitor",
    eyebrow: "Step 17 · Make the mapping visible",
    title: "Open and read the Serial Monitor",
    instruction:
      "Open Serial Monitor after the upload. Turn Pot1 slowly and watch how the knob value changes with the servo angle.",
    checks: [
      "The Serial Monitor is open.",
      "The baud rate is set to 9600.",
      "Each line displays a potentiometer value and servo angle.",
      "As the potentiometer value increases, the mapped angle also increases.",
    ],
    question: {
      text: "What angle should an ADC value near 512 produce?",
      options: [
        "About 90 degrees",
        "About 0 degrees",
        "About 180 degrees",
      ],
      correct: 0,
    },
    tip: "Approximately: 0 → 0°, 256 → 45°, 512 → 90°, 768 → 135°, and 1023 → 180°.",
  },
  {
    short: "Test",
    eyebrow: "Step 18 · Evidence",
    title: "Complete three controlled tests",
    instruction:
      "Test the system in three positions: low, middle, and high. Use real values from the Serial Monitor.",
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
      "Full name, group, and date are complete.",
      "The final Arduino sketch is saved with the assigned filename.",
      "All three test results and the observation are complete.",
      "The live demonstration and English explanation are ready.",
      "The workspace is organized and all equipment will be returned correctly.",
    ],
    tip: "The complete activity is worth 40 points.",
  },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [current, setCurrent] = useState(0);
  const [confirmed, setConfirmed] = useState<boolean[]>(
    () => stages.map(() => false),
  );
  const [copied, setCopied] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [studentInfo, setStudentInfo] = useState({
    fullName: "",
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
          fullName: String(data.studentInfo.fullName || ""),
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

  const stage = stages[current];
  const quizCorrect =
    !stage.question || quizAnswers[current] === stage.question.correct;
  const studentInfoComplete =
    current !== 0 ||
    Boolean(
      studentInfo.fullName.trim() &&
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
    setShowReport(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function next() {
    if (!confirmed[current]) return;
    setCurrent((value) => Math.min(value + 1, stages.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    if (current === 0) {
      setStarted(false);
    } else {
      setCurrent((value) => value - 1);
    }
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
          <button className="back-button" onClick={() => setShowReport(false)} type="button">
            Back to tutorial
          </button>
        </header>

        <section className="report-page">
          <div className="report-actions">
            <button className="next-button" onClick={() => window.print()} type="button">
              Print full report
            </button>
          </div>

          <article className="report-document">
            <header className="report-heading">
              <p>Academia Internacional David · Technology & Robotics</p>
              <h1>Freenove Servo Tutorial Report</h1>
              <dl>
                <div><dt>Name</dt><dd>{studentInfo.fullName || "Not entered"}</dd></div>
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
            <Image
              alt="Freenove board with Pot1 beside a servo"
              height={1024}
              priority
              src="assets/freenove-pot1-servo.svg"
              width={1536}
            />
            <div className="visual-flow"><span>INPUT · A1</span><i /><b>YOU BUILD THE LOGIC</b><i /><span>OUTPUT · PIN 3</span></div>
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
          <div
            className={[
              index === current ? "current" : "",
              confirmed[index] ? "complete" : "",
              index > current ? "future" : "",
            ].join(" ")}
            key={item.short}
            title={index <= current ? item.short : "Not reached yet"}
          >
            <span>{confirmed[index] ? "✓" : index + 1}</span>
            <b>{index === current ? item.short : ""}</b>
          </div>
        ))}
      </div>

      <section className="stage-page">
        <article className="focus-card">
          <div className="stage-count">Step {current + 1} of {stages.length}</div>
          <p className="step-eyebrow">{stage.eyebrow}</p>
          <h1>{stage.title}</h1>
          <section className="context-box" aria-label="Step context">
            <span>Step context</span>
            <p>{stage.instruction}</p>
          </section>

          {current === 0 && (
            <div className="student-info" aria-label="Student information">
              <label>
                <span>Full name</span>
                <input
                  autoComplete="name"
                  onChange={(event) =>
                    setStudentInfo((info) => ({ ...info, fullName: event.target.value }))
                  }
                  placeholder="Enter your full name"
                  type="text"
                  value={studentInfo.fullName}
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
              <Image
                alt={
                  stage.image === "selector"
                    ? "Freenove manual selector diagram showing switch 1 for Pot1 and A1 moved to ON"
                    : "Freenove board and servo connection reference"
                }
                height={stage.image === "selector" ? 330 : 1024}
                src={
                  stage.image === "selector"
                    ? "assets/pot1-a1-selector-manual.svg"
                    : "assets/freenove-pot1-servo.svg"
                }
                width={stage.image === "selector" ? 360 : 1536}
              />
              {stage.image === "selector" && (
                <p className="manual-caption">
                  From the Freenove manual: move selector <b>1</b> (Pot1 / A1) toward <b>ON</b>.
                </p>
              )}
            </div>
          )}

          {stage.code && (
            <div className="code-piece">
              <div className="code-piece-head">
                <span>Code piece {stages.slice(0, current + 1).filter((item) => item.code).length} of 9</span>
                <button onClick={copyPiece} type="button">{copied ? "✓ Copied" : "Copy this piece"}</button>
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
            <fieldset className="quiz-box">
              <legend>
                <span className="practice-label">Practice</span>
                {stage.question.text}
              </legend>
              <div className="quiz-options">
                {stage.question.options.map((option, index) => (
                  <button
                    aria-pressed={quizAnswers[current] === index}
                    className={quizAnswers[current] === index ? "selected" : ""}
                    key={option}
                    onClick={() =>
                      setQuizAnswers((answers) => ({ ...answers, [current]: index }))
                    }
                    type="button"
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    {option}
                  </button>
                ))}
              </div>
              {quizAnswers[current] !== undefined && (
                <p className={quizCorrect ? "quiz-correct" : "quiz-incorrect"} role="status">
                  {quizCorrect
                    ? stage.question.correctFeedback || "Correct. This matches the step context."
                    : stage.question.incorrectFeedback || "Review the step context above, then try again."}
                </p>
              )}
            </fieldset>
          )}

          {stage.tip && <div className="tip-box"><b>Remember</b><p>{stage.tip}</p></div>}

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
                {!quizCorrect
                  ? "Practice is optional. Review the context if your answer was not correct."
                  : !studentInfoComplete
                    ? "Enter your full name, group, and date to unlock this confirmation."
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
    </main>
  );
}
