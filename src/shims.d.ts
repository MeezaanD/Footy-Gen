declare module "*.css";
declare module "@heroicons/react/24/outline";
declare module "*.astro";

declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}
