// The Funniest Out-of-Office — entry program (make.fun, program/v1, Node 22).
// Writes a single line of an out-of-office auto-reply, at most 140
// characters, to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt).
// The line is the whole entry: one line of text, nothing else.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Out of office. I set this auto-reply in March and have been on holiday ever since. Nobody noticed.";

const MAX_CHARS = 140;

function codePointLength(text: string): number {
  return [...text].length;
}

function validateEntry(text: string): string[] {
  const problems: string[] = [];
  if (text.length === 0) problems.push("entry is empty");
  if (codePointLength(text) > MAX_CHARS) {
    problems.push(
      `entry is ${codePointLength(text)} characters, over the ${MAX_CHARS} cap`,
    );
  }
  if (text.trim() !== text) {
    problems.push("entry has leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    problems.push("entry must be a single line with no newline");
  }
  if (text.trim().length === 0) {
    problems.push("entry is only whitespace");
  }
  return problems;
}

const problems = validateEntry(ENTRY);
if (problems.length > 0) {
  for (const problem of problems) console.error(`invalid entry: ${problem}`);
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
const outputPath = join(outputDir, "entry.txt");
writeFileSync(outputPath, ENTRY, "utf8");

// Read-back round-trip: the file on disk must be byte-identical to the
// validated entry, with no trailing newline added by the write.
const written = readFileSync(outputPath, "utf8");
if (written !== ENTRY) {
  console.error("round-trip mismatch: file content differs from entry");
  process.exit(1);
}
console.log(
  `wrote ${codePointLength(ENTRY)} characters to ${outputPath}`,
);
