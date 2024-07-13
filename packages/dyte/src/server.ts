import { join, toFileUrl } from "../deps.ts";
import { BundleOptions } from "./options/BundleOptions.ts";
import { ServerOptions } from "./options/ServeOptions.ts";
import { devTranspile } from "./bundle.ts";
import { Resolver } from "./resolver.ts";

export type DyteActiveServer = {
  close: (onEnd: () => void) => void;
};

export type DyteServer = {
  listen: (
    port: number,
    onListen?: () => void,
    onAbort?: () => void,
  ) => DyteActiveServer;
};

export function serve(
  serverOptions: ServerOptions,
  bundleOptions?: BundleOptions,
): DyteServer {
  let dependencyMap = new Map<string, string>([]);
  /** @type {(req: Request) => Promise<Response>} */
  const handler: (req: Request) => Promise<Response> = async (
    req,
  ): Promise<Response> => {
    // get pathname
    const url = new URL(req.url);
    const pathname = url.pathname;

    /** Get file path @type {string} */
    const filePath: string = join(
      serverOptions.dir,
      pathname.startsWith("/") ? pathname.replace("/", "") : pathname,
    );

    // configure bundle serverOptions
    bundleOptions = bundleOptions
      ? {
        ...bundleOptions,
        ...{
          mode: "development",
        },
      }
      : {
        mode: "development",
      };

    try {
      if (pathname === "/") {
        // return index
        return new Response(
          Deno.readTextFileSync(join(filePath, "index.html")),
          {
            headers: {
              "content-type": "text/html",
            },
          },
        );
      } else if (
        !([".js", ".ts", ".jsx", ".tsx"].every((item) =>
          !pathname.endsWith(item)
        ))
      ) {
        const fileurl = toFileUrl(Deno.realPathSync(filePath)).toString();
        if (dependencyMap.get(fileurl) || dependencyMap.get(filePath)) {
          const code = Resolver.resolve(
            dependencyMap.get(fileurl) ?? dependencyMap.get(filePath) ?? "",
            dependencyMap,
          );
          return new Response(code, {
            headers: {
              "content-type": "application/javascript",
            },
          });
        }
        // transpile file
        const map = await devTranspile(filePath, bundleOptions);
        dependencyMap = new Map([...dependencyMap, ...map]);
        const code = Resolver.resolve(
          dependencyMap.get(fileurl) ?? dependencyMap.get(filePath) ?? "",
          dependencyMap,
        );
        return new Response(code, {
          headers: {
            "content-type": "application/javascript",
          },
        });
      } else {
        const file = serverOptions.publicDir &&
            pathname.startsWith(serverOptions.publicRoot)
          ? join(
            serverOptions.publicDir,
            pathname.replace(serverOptions.publicRoot, ""),
          )
          : pathname.replace("/", "");
        return new Response(Deno.readTextFileSync(file));
      }
    } catch (error) {
      // console error
      console.error("Error transpiling TypeScript file:", error);

      // TODO: Render error page
      throw createError({
        status: 500,
        message: "Error transpiling TypeScript file",
        name: "Compilation Error",
      });
    }
  };
  return {
    listen: (
      port,
      onListen,
      onAbort,
    ) => {
      const server = Deno.serve(
        { port, hostname: serverOptions.host, onListen },
        handler,
      );
      server.finished.then(onAbort);
      return {
        close: (onEnd) => {
          server.shutdown();
          onEnd();
        },
      };
    },
  };
}

/**
 * Creates error in opinionated way
 * @param {Object} options
 * @param {number} [options.status]
 * @param {string} [options.message]
 * @param {string} [options.name]
 * @returns {Error}
 */
function createError(
  options: { status?: number; message?: string; name?: string },
): Error {
  return new ServerError(
    options.status ?? 500,
    options.message ?? "An unknown error has occured",
    options.name ?? "Unknown Error",
  );
}

/**
 * Server Error class
 */
class ServerError extends Error {
  /** @type {number} */
  status: number;

  /**
   * Constructor for a server error
   * @param {number} status
   * @param {string} message
   * @param {string} [name]
   */
  constructor(
    status: number,
    message: string,
    name: string,
  ) {
    super(message);
    this.status = status;
    if (name) this.name = name;
  }
}
