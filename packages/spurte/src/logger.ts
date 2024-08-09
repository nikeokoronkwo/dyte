import {
  blue,
  bold,
  gray,
  green,
  magenta,
  red,
  yellow,
} from "../deps.ts";

type LogMode = "info" | "warn" | "error" | "fine" | "cmd" | "none";

export class Logger {
  protected encoder: TextEncoder = new TextEncoder();

  static verbose(): Logger {
    return new VerboseLogger();
  }

  print(msg: string, mode: LogMode) {
    switch (mode) {
      case "info":
        this.info(msg);
        break;
      case "warn":
        this.warn(msg);
        break;
      case "error":
        this.error(msg);
        break;
      case "fine":
        this.fine(msg);
        break;
      case "cmd":
        this.cmd(msg);
        break;
      case "none":
        this.stdout(msg);
        break;
    }
  }

  info(msg: string) {
    console.log(blue(msg));
  }
  stdout(msg: string) {
    console.log(msg);
  }
  stderr(msg: string) {
    Deno.stderr.write(this.encoder.encode(`${msg}\n`))
  }
  warn(msg: string) {
    console.log(yellow(msg));
  }
  error(msg: string, error: boolean = false) {
    error ? Deno.stderr.write(this.encoder.encode(red(`${msg}\n`))) : console.log(red(msg));
  }
  fine(msg: string) {
    console.log(green(msg));
  }
  cmd(msg: string) {
    console.log(magenta(msg))
  }

  verbose(msg: string) {}
}

export class VerboseLogger extends Logger {
  override verbose(msg: string): void {
    console.log(gray(bold("[VERBOSE]")), gray(msg));
  }

  override info(msg: string) {
    console.log(blue("[INFO]"), msg);
  }
  override warn(msg: string) {
    console.log(yellow("[WARN]"), msg);
  }
  override error(msg: string, error: boolean = false) {
    error ? Deno.stderr.write(this.encoder.encode(`${red("[SEVERE]")} ${msg}\n`)) : console.log(red("[SEVERE]"), msg);
  }
  override fine(msg: string) {
    console.log(green("[FINE]"), msg);
  }
  override cmd(msg: string) {
    console.log(magenta("[CMD]"), msg);
  }
}
