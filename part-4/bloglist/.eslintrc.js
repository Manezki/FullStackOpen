module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    "airbnb-base",
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    indent: [
      "error",
      2,
    ],
    quotes: [
      "error",
      "double",
    ],
    semi: [
      "error",
      "never",
    ],
    "no-console": 0,
  },
}
