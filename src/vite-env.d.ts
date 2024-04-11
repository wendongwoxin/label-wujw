/// <reference types="vite/client" />

declare module "*.vue" {
  import { CompilerOptions } from "vue";
  const componentOptions: CompilerOptions;
  export default componentOptions;
}
