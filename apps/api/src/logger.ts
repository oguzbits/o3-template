/** Structured JSON lines. Fields carry IDs, lengths and durations, never user content. */
type LogFields = Record<string, string | number | boolean>;
type LogSink = (line: string) => void;

export interface Logger {
  info(event: string, fields?: LogFields): void;
  error(event: string, fields?: LogFields): void;
}

const LEVEL = {
  INFO: 'info',
  ERROR: 'error',
} as const;

function writeLine(sink: LogSink, level: string, event: string, fields: LogFields = {}): void {
  sink(JSON.stringify({ level, event, ...fields }));
}

export function createLogger(sink: LogSink): Logger {
  return {
    info: (event, fields) => writeLine(sink, LEVEL.INFO, event, fields),
    error: (event, fields) => writeLine(sink, LEVEL.ERROR, event, fields),
  };
}

export function stdoutSink(line: string): void {
  process.stdout.write(`${line}\n`);
}
