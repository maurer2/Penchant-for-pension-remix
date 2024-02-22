/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: false,
  },
  rules: {
    "import/prefer-default-export": "off",
  },

  // Base config
  extends: ["eslint:recommended"],

  overrides: [
    // React
    {
      files: ["**/*.{js,jsx,ts,tsx,tsm}"],
      plugins: ["react", "jsx-a11y"],
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
      ],
      settings: {
        react: {
          version: "detect",
        },
        formComponents: ["Form"],
        linkComponents: [
          { name: "Link", linkAttribute: "to" },
          { name: "NavLink", linkAttribute: "to" },
        ],
        "import/resolver": {
          typescript: {},
        },
      },
    },

    // Typescript
    {
      files: ["**/*.{ts,tsx,tsm}"],
      plugins: ["@typescript-eslint", "import"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json"
      },
      settings: {
        "import/internal-regex": "^~/",
        "import/resolver": {
          node: {
            extensions: [".ts", ".tsx", ".tsm"],
          },
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      rules: {
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/consistent-type-imports": "warn"
      },
      extends: [
        "plugin:@typescript-eslint/strict-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
        "plugin:import/recommended",
        "plugin:import/typescript",
      ],
    },

    // Node
    {
      files: [".eslintrc.js"],
      env: {
        node: true,
      },
    },
  ],
};
