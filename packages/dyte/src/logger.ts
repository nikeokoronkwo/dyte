import {
  blue,
  bold,
  gray,
  green,
  magenta,
  red,
  yellow,
} from "jsr:@std/fmt/colors";

type LogMode = "info" | "warn" | "error" | "fine" | "cmd";

export class Logger {
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
    }
  }

  info(msg: string) {
    console.log(msg);
  }
  warn(msg: string) {
    console.log(yellow(msg));
  }
  error(msg: string) {
    console.log(red(msg));
  }
  fine(msg: string) {
    console.log(green(msg));
  }
  cmd(msg: string) {}

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
  override error(msg: string) {
    console.log(red("[SEVERE]"), msg);
  }
  override fine(msg: string) {
    console.log(green("[FINE]"), msg);
  }
  override cmd(msg: string) {
    console.log(magenta("[CMD]"), msg);
  }
}
