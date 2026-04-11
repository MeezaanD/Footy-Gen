declare module "*.css";
declare module "*TeamGeneratorApp*";

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
