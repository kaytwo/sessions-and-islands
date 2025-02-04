// synchronously declared in index.html to promisify google api library loading callbacks
declare const gsiLoadPromise: Promise<void>;

declare namespace App {
  interface Locals {
    user?: import("./stores.ts").UserMetadata;
  }
}
