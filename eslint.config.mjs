import pluginJs from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", "tests/**"]
  },
  {
    languageOptions: { 
      globals: globals.node 
    }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn", 
      "no-console": "off"      
    }
  }
];