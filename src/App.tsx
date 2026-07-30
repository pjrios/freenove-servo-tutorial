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
  prompt?: string;
  tip?: string;
  image?: "connection" | "selector";
  video?: boolean;
  question?: {
    text: string;
    options: string[];
    correct: number;
  };
};

const stages: Stage[] = [
  {
    short: "Prepare",
    eyebrow: "Stage 1 · Before touching the board",
    title: "Are you prepared?",
    instruction:
      "Do not connect anything yet. Prepare your information, equipment, and work area first.",
    checks: [
      "Confirm that your Freenove kit number matches the assigned kit.",
      "Have your computer, charger, Arduino IDE, and assigned document ready.",
      "Keep the Freenove board disconnected from USB.",
    ],
    tip: "You should not continue until your full name, group, date, and all three preparation items are complete.",
  },
  {
    short: "Meet Servo",
    eyebrow: "Stage 2 · Introduction",
    title: "What is a servo motor?",
    instruction:
      "A servo is a motor used for precise position control. It converts electrical energy into mechanical movement, but unlike a basic DC motor, it receives a signal that tells it how far to rotate. Watch the required introduction, then answer the question.",
    video: true,
    question: {
      text: "What makes a servo different from a basic DC motor?",
      options: [
        "It receives a signal telling it to move to a specific angle.",
        "It can only rotate continuously.",
        "It does not use electrical energy.",
      ],
      correct: 0,
    },
    tip: "In this project, Pot1 provides the input. Arduino maps that value to an angle and tells the servo where to move.",
  },
  {
    short: "Connect",
    eyebrow: "Stage 3 · Hardware",
    title: "Connect only the servo",
    instruction:
      "With the board disconnected, connect the servo to the three-pin connection controlled by digital pin 3. Match ground, power, and signal. Never force the connector.",
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
    eyebrow: "Stage 4 · Input",
    title: "Set Pot1 to A1",
    instruction:
      "The potentiometer is already built into the Freenove Projects Board. Set the selector so Pot1 uses analog input A1. Do not add breadboard wires.",
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
    eyebrow: "Stage 5 · Arduino IDE check",
    title: "Check the Servo library",
    instruction:
      "The official Servo library is normally already included with the Arduino IDE. Check for it before writing the first code piece; install it only if it is missing.",
    checks: [
      "Open File → Examples and look for Servo.",
      "If Servo appears, it is already available—do not reinstall it.",
      "If it is missing, open Tools → Manage Libraries… (or the Library Manager icon).",
      "Search for Servo, choose the official Servo library by Arduino, and select Install.",
    ],
    tip: "If the IDE later reports “Servo.h: No such file or directory,” return to Library Manager and install Servo.",
  },
  {
    short: "Include",
    eyebrow: "Stage 6 · Code piece 1",
    title: "Add the Servo library and object",
    instruction:
      "Type this first piece at the very top of your empty Arduino sketch. Do not copy code from a later stage.",
    code: `#include <Servo.h>\n\nServo myServo;`,
    prompt:
      "In your planning document, explain: What does the library add? What will myServo represent?",
    tip: "The library gives Arduino the instructions needed to control a servo.",
  },
  {
    short: "Pins",
    eyebrow: "Stage 7 · Code piece 2",
    title: "Name the two pins",
    instruction:
      "Add these lines under the servo object. Using names makes the rest of the sketch easier to read.",
    code: `const int potPin = A1;\nconst int servoPin = 3;`,
    prompt:
      "In your planning document, identify which line represents the input and which represents the output.",
    tip: "const means these pin numbers will not change while the program runs.",
  },
  {
    short: "Setup",
    eyebrow: "Stage 8 · Code piece 3",
    title: "Attach the servo",
    instruction:
      "Start the setup function and attach the servo to its named pin. setup() runs only once when the Arduino starts.",
    code: `void setup() {\n  myServo.attach(servoPin);`,
    prompt:
      "Explain why attach() uses servoPin and why this instruction belongs inside setup().",
    tip: "This tells the Servo object which physical signal pin it controls.",
  },
  {
    short: "Start Serial",
    eyebrow: "Stage 9 · Code piece 4",
    title: "Start serial communication",
    instruction:
      "Add this line beneath attach(), then close setup(). It creates a communication channel between the Arduino and the Serial Monitor.",
    code: `  Serial.begin(9600);\n}`,
    prompt:
      "What does 9600 represent, and why must the Serial Monitor use the same setting?",
    tip: "9600 is the baud rate—the communication speed used by both the board and Serial Monitor.",
  },
  {
    short: "Read",
    eyebrow: "Stage 10 · Code piece 5",
    title: "Read Pot1",
    instruction:
      "Start the loop and read the analog value from Pot1. The loop repeats while the Arduino is powered.",
    code: `void loop() {\n  int adcValue = analogRead(potPin);`,
    prompt:
      "Predict the minimum and maximum values that adcValue can store.",
    tip: "Remember the Arduino analog range: 0 to 1023.",
  },
  {
    short: "Map",
    eyebrow: "Stage 11 · Code piece 6",
    title: "Convert the value into an angle",
    instruction:
      "Add this line inside loop(). It changes the potentiometer range into a range the servo can use.",
    code: `  int angle = map(adcValue, 0, 1023, 0, 180);`,
    prompt:
      "Explain what each range means: 0–1023 and 0–180.",
    tip: "map() converts the input scale; it does not move the servo by itself.",
  },
  {
    short: "Move",
    eyebrow: "Stage 12 · Code piece 7",
    title: "Move the servo",
    instruction:
      "Use the calculated angle to move the servo. Keep loop() open because the next stages will add the Serial Monitor evidence.",
    code: `  myServo.write(angle);`,
    prompt:
      "Explain why servo.write() uses angle instead of the original adcValue.",
    tip: "The servo expects an angle, not a raw analog value from 0 to 1023.",
  },
  {
    short: "Print ADC",
    eyebrow: "Stage 13 · Code piece 8",
    title: "Print the raw input",
    instruction:
      "Add these lines inside loop(). They label and print the original Pot1 reading.",
    code: `  Serial.print("Potentiometer: ");\n  Serial.print(adcValue);`,
    prompt:
      "Why is adcValue useful evidence even though it does not directly control the servo?",
    tip: "This lets you see the actual input value from 0 to 1023.",
  },
  {
    short: "Print Angle",
    eyebrow: "Stage 14 · Code piece 9",
    title: "Print the mapped angle",
    instruction:
      "Add the angle label and value, pause briefly, and close loop(). println() moves the next reading to a new line.",
    code: `  Serial.print(" | Servo angle: ");\n  Serial.println(angle);\n  delay(100);\n}`,
    prompt:
      "Explain the difference between Serial.print() and Serial.println(). Why is a short delay helpful?",
    tip: "Each line will now show one input–output pair, such as Potentiometer: 512 | Servo angle: 90.",
  },
  {
    short: "Complete Code",
    eyebrow: "Stage 15 · Assemble your work",
    title: "Show your complete sketch",
    instruction:
      "You have now built all nine code pieces in Arduino IDE. Review the complete program you assembled, then paste it below exactly as it appears in your sketch. This is the first and only stage that asks for the complete code.",
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
    eyebrow: "Stage 16 · Arduino IDE",
    title: "Verify and upload",
    instruction:
      "Now connect the USB cable. Select the correct board and port, verify the sketch, and upload it. Read any error before changing your code.",
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
    eyebrow: "Stage 17 · Make the mapping visible",
    title: "Open and read the Serial Monitor",
    instruction:
      "Open Tools → Serial Monitor after the upload. Set it to 9600 baud, turn Pot1 slowly, and watch how each raw reading maps to an angle.",
    checks: [
      "The Serial Monitor is open.",
      "The baud rate is set to 9600.",
      "Each line displays a potentiometer value and servo angle.",
      "As the potentiometer value increases, the mapped angle also increases.",
    ],
    prompt:
      "Predict the angle for an ADC value near 512, then compare your prediction with the displayed result.",
    tip: "Approximately: 0 → 0°, 256 → 45°, 512 → 90°, 768 → 135°, and 1023 → 180°.",
  },
  {
    short: "Test",
    eyebrow: "Stage 18 · Evidence",
    title: "Complete three controlled tests",
    instruction:
      "Use the Serial Monitor and test low, middle, and high Pot1 positions. Record real values—do not invent them.",
    checks: [
      "Low position: record ADC value, calculated angle, and observed position.",
      "Middle position: record ADC value, calculated angle, and observed position.",
      "High position: record ADC value, calculated angle, and observed position.",
      "Confirm that the servo movement matches the recorded values.",
    ],
    prompt:
      "Write one observation describing the relationship between Pot1, the ADC value, and the servo angle.",
  },
  {
    short: "Explain",
    eyebrow: "Stage 19 · English explanation",
    title: "Prepare your explanation",
    instruction:
      "Explain the complete input–process–output relationship in your own words. Do not simply read the code.",
    checks: [
      "Identify Pot1 on A1 as the input.",
      "Explain that analogRead produces a value from 0 to 1023.",
      "Explain that map converts the value to an angle from 0° to 180°.",
      "Identify the servo on pin 3 as the output.",
      "Use at least three vocabulary words correctly.",
    ],
    prompt:
      "Vocabulary: servo, angle, signal, input, output, analog value, map.",
  },
  {
    short: "Submit",
    eyebrow: "Stage 20 · Final check",
    title: "Save, demonstrate, and submit",
    instruction:
      "You are at the final stage. Review the required evidence before asking the teacher to evaluate your work.",
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
  const [writtenResponses, setWrittenResponses] = useState<Record<number, string>>({});
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
      if (data.writtenResponses && typeof data.writtenResponses === "object") {
        setWrittenResponses(data.writtenResponses);
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
        writtenResponses,
        finalSketch,
      }),
    );
  }, [
    started,
    current,
    confirmed,
    quizAnswers,
    studentInfo,
    writtenResponses,
    finalSketch,
  ]);

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
  const writtenResponseComplete =
    !stage.prompt || Boolean(writtenResponses[current]?.trim());
  const finalCodeStage = stage.short === "Complete Code";
  const finalSketchComplete = !finalCodeStage || Boolean(finalSketch.trim());
  const canConfirm =
    quizCorrect &&
    studentInfoComplete &&
    writtenResponseComplete &&
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
              explain your work, and then unlock the next stage.
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
          <div className="stage-count">Stage {current + 1} of {stages.length}</div>
          <p className="step-eyebrow">{stage.eyebrow}</p>
          <h1>{stage.title}</h1>
          <p className="instruction">{stage.instruction}</p>

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

          {stage.question && (
            <fieldset className="quiz-box">
              <legend>{stage.question.text}</legend>
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
                    ? "Correct! A positional servo receives a control signal that tells it which angle to move to."
                    : "Not quite. Rewatch the section explaining how the motor receives a signal, then try again."}
                </p>
              )}
            </fieldset>
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
              <p>Type this below the code from the previous stage in Arduino IDE. Do not replace your sketch.</p>
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
              {stage.checks.map((check, index) => (
                <div key={check}><span>{index + 1}</span><p>{check}</p></div>
              ))}
            </div>
          )}

          {stage.prompt && (
            <div className="thinking-box">
              <span>✎ Sketch-planning checkpoint</span>
              <p>{stage.prompt}</p>
              <label className="response-field">
                <span>Your response</span>
                <textarea
                  onChange={(event) =>
                    setWrittenResponses((responses) => ({
                      ...responses,
                      [current]: event.target.value,
                    }))
                  }
                  placeholder={
                    stage.short === "Test"
                      ? "Example starter: When I turn Pot1…"
                      : "Write your answer in your own words…"
                  }
                  value={writtenResponses[current] || ""}
                />
              </label>
            </div>
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
              <b>I completed this stage.</b>
              <small>
                {!quizCorrect
                  ? "Answer the question correctly to unlock this confirmation."
                  : !studentInfoComplete
                    ? "Enter your full name, group, and date to unlock this confirmation."
                    : !finalSketchComplete
                      ? "Paste your complete assembled Arduino sketch to unlock this confirmation."
                      : !writtenResponseComplete
                        ? "Write your response to the checkpoint to unlock this confirmation."
                    : "I can show or explain the required evidence."}
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
            <button className="next-button" disabled={!confirmed[current]} onClick={() => window.print()} type="button">
              ✓ Finished · Print
            </button>
          )}
        </nav>
        {!confirmed[current] && <p className="unlock-note">Confirm the stage above to unlock Next.</p>}
      </section>
    </main>
  );
}
