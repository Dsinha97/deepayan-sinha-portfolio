#!/usr/bin/env node
// PreToolUse(Bash) hook: rewrites noisy commands (installs, builds, test runs,
// anything that prints a progress bar) so only signal comes back to the model.
// Two modes:
//   (no args)   -> read the PreToolUse hook payload from stdin, decide whether
//                  the command is noisy, and if so emit hookSpecificOutput
//                  with an updatedInput.command that captures the real output
//                  to a temp file and re-invokes this script in --render mode.
//   --render F  -> read captured output from file F and print only the lines
//                  that matter: flagged errors/failures plus a final tail.

const fs = require("fs");

const NOISY_PATTERNS = [
  /\bnpm\b\s+(i|install|ci|update|audit|run\s+\S+|test|build)\b/i,
  /\byarn\b\s*(add|install|build|test)?\b/i,
  /\bpnpm\b\s+(i|install|add|update|run\s+\S+|test|build)\b/i,
  /\bpip3?\b\s+install\b/i,
  /\bcargo\b\s+(build|test|install)\b/i,
  /\bdocker\b\s+(build|pull|push)\b/i,
  /\bwebpack\b/i,
  /\bvite\b\s+build\b/i,
  /\bnext\b\s+build\b/i,
  /\btsc\b/i,
  /\bastro\b\s+(check|build)\b/i,
  /\bwrangler\b\s+(deploy|publish)\b/i,
  /\bmvn\b/i,
  /\bgradlew?\b/i,
  /\bmake\b/i,
  /\bcomposer\b\s+install\b/i,
  /\bbundle\b\s+install\b/i,
  /\bgit\s+clone\b/i,
  /\bcurl\b.*(-O|--output|-#)\b/i,
  /\bwget\b/i,
];

const FLAG_PATTERN =
  /\berror\b|\bfail(ed|ure)?\b|\bexception\b|\bfatal\b|✗|✖|✘|ENOENT|EACCES|EPERM|cannot find|not found|vulnerabilit|deprecat/i;

const TAIL_LINES = 20;

function isNoisy(command) {
  return NOISY_PATTERNS.some((re) => re.test(command));
}

function render(filePath) {
  let raw = "";
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch {
    return;
  }
  const lines = raw.split(/\r?\n/);
  while (lines.length && lines[lines.length - 1] === "") lines.pop();
  const total = lines.length;

  if (total <= TAIL_LINES) {
    // Short output after all — just print it verbatim, nothing to trim.
    process.stdout.write(lines.join("\n") + "\n");
    return;
  }

  const tail = lines.slice(-TAIL_LINES);
  const tailSet = new Set(tail);
  const flagged = lines.filter((l) => FLAG_PATTERN.test(l) && !tailSet.has(l));

  const out = [];
  out.push(`[noisy-command-filter] captured ${total} lines, showing flagged lines + final ${TAIL_LINES}`);
  if (flagged.length) {
    out.push("--- flagged (error/fail/warn) ---");
    out.push(...flagged);
  }
  out.push(`--- final ${TAIL_LINES} lines ---`);
  out.push(...tail);
  process.stdout.write(out.join("\n") + "\n");
}

function main() {
  const args = process.argv.slice(2);
  if (args[0] === "--render") {
    render(args[1]);
    return;
  }

  let payload = "";
  try {
    payload = fs.readFileSync(0, "utf8");
  } catch {
    return;
  }
  let data;
  try {
    data = JSON.parse(payload);
  } catch {
    return;
  }

  const command = data && data.tool_input && data.tool_input.command;
  if (!command || typeof command !== "string" || !isNoisy(command)) {
    return; // leave it alone
  }

  const selfPath = __filename.replace(/\\/g, "/");
  const wrapped =
    `TMPFILE=$(mktemp); ` +
    `{ ${command} ; } > "$TMPFILE" 2>&1; ` +
    `CODE=$?; ` +
    `node "${selfPath}" --render "$TMPFILE"; ` +
    `rm -f "$TMPFILE"; ` +
    `exit $CODE`;

  const result = {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "allow",
      permissionDecisionReason:
        "Noisy command detected — output will be filtered to errors/failures + final summary.",
      updatedInput: { command: wrapped },
    },
  };
  process.stdout.write(JSON.stringify(result));
}

main();
