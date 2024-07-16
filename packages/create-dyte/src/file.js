import { join } from "jsr:@std/path/join";
import { ExistsError } from "./errors.js";

/**
 * A file object class, used for easy scaffolding of files via names
 */
export class File {
  /**
   * Constructor function to create a new file object
   * @param {string} name The name of the file
   * @param {string} [contents] The contents of the file
   */
  constructor(name, contents) {
    this.name = name;
    this.contents = contents ?? "";
  }

  /**
   * Creates the file on the system synchronously
   * @param {string} [at] The directory to create the file at (defaults to {@link Deno.cwd()})
   * @returns {void}
   */
  createSync(at) {
    const file = Deno.createSync(join(at ?? Deno.cwd(), this.name));
    file.writeSync(new TextEncoder().encode(this.contents));
  }

  /**
   * Creates the file asynchronously
   * @async
   * @param {string} [at] The directory to create the file at (defaults to {@link Deno.cwd()})
   * @returns {Promise<void>}
   */
  async create(at) {
    await Deno.create(join(at ?? Deno.cwd(), this.name)).then(async (file) =>
      await file.write(new TextEncoder().encode(this.contents))
    );
  }
}

/**
 * A folder class for easy scaffolding of folders and files within it
 */
export class Folder {
  /**
   * @param {string} name
   * @param {Array<File>} [files=[]]
   * @param {Array<Folder>} [folders=[]]
   */
  constructor(name, files, folders) {
    this.name = name;
    this.files = files ?? [];
    this.folders = folders ?? [];
  }

  /**
   * @param {File} file The new file to be added
   * @returns {Folder}
   */
  addFile(file) {
    this.files.push(file);
    return this;
  }

  /**
   * @param {Folder} folder
   * @returns {Folder}
   */
  addFolder(folder) {
    this.folders.push(folder);
    return this;
  }

  /**
   * Creates the folder asynchronously
   * @async
   * @param {string} [at] The directory to create the file at (defaults to {@link Deno.cwd()})
   * @param {boolean} [force] Whether to force creation of the folder if it already exists
   * @returns {Promise<void>}
   */
  async create(at, force) {
    const folderDir = join(at ?? Deno.cwd(), this.name);
    try {
      await Deno.mkdir(folderDir, { recursive: force ?? false });
    } catch (e) {
      throw new ExistsError(`Directory at ${folderDir} already exists`, {
        cause: e,
      });
    }
    for (const file of this.files) await file.create(folderDir);
    for (const folder of this.folders) await folder.create(folderDir);
  }

  /**
   * Creates the folder synchronously
   * @param {string} [at] The directory to create the file at (defaults to {@link Deno.cwd()})
   * @param {boolean} [force] Whether to force creation of the folder if it already exists
   * @returns {Promise<void>}
   */
  createSync(at, force) {
    const folderDir = join(at ?? Deno.cwd(), this.name);
    try {
      Deno.mkdirSync(folderDir, { recursive: force ?? false });
    } catch (e) {
      throw new ExistsError(`Directory at ${folderDir} already exists`, {
        cause: e,
      });
    }
    for (const file of this.files) file.createSync(folderDir);
    for (const folder of this.folders) folder.createSync(folderDir);
  }
}
