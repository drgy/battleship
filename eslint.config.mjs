import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from '@stylistic/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import {globalIgnores} from "eslint/config";


/** @type {import('eslint').Linter.Config[]} */
export default [
	{files: ["**/*.{js,mjs,cjs,ts}"]},
	{languageOptions: { globals: globals.browser, parser: parserTs }},
	pluginJs.configs.recommended,
	globalIgnores(['log.js', 'vite/*']),
	...tseslint.configs.recommended,
	{
		plugins: {'@stylistic': stylistic},
		rules: {
			"array-callback-return": ["error", { allowImplicit: true, checkForEach: true }],
			"no-constructor-return": ["error"],
			"no-duplicate-imports": ["error"],
			"no-promise-executor-return": ["error"],
			"no-self-compare": ["error"],
			"no-unmodified-loop-condition": ["error"],
			"no-unreachable-loop": ["error"],
			"require-atomic-updates": ["error"],
			"accessor-pairs": ["error"],
			"arrow-body-style": ["error", "as-needed"],
			"curly": ["error", "all"],
			"new-cap": ["error"],
			"no-extra-bind": ["error"],
			"no-lone-blocks": ["error"],
			"no-lonely-if": ["error"],
			"no-loop-func": ["error"],
			"no-unneeded-ternary": ["error"],
			"no-useless-return": ["error"],
			"operator-assignment": ["error", "always"],
			"prefer-arrow-callback": ["error"],
			"prefer-const": ["error"],
			"prefer-exponentiation-operator": ["error"],
			"prefer-numeric-literals": ["error"],
			"prefer-object-has-own": ["error"],
			"prefer-object-spread": ["error"],
			"prefer-rest-params": ["error"],
			"prefer-spread": ["error"],
			"prefer-template": ["error"],
			"@stylistic/block-spacing": ["error"],
			"@stylistic/brace-style": ["error"],
			"@stylistic/comma-dangle": ["error"],
			"@stylistic/comma-spacing": ["error"],
			"@stylistic/comma-style": ["error"],
			"@stylistic/function-call-spacing": ["error"],
			"@stylistic/indent": ["error", "tab"],
			"@stylistic/key-spacing": ["error"],
			"@stylistic/keyword-spacing": ["error"],
			"@stylistic/member-delimiter-style": ["error"],
			"@stylistic/no-extra-semi": ["error"],
			"@stylistic/curly-newline": ["error", { "multiline": true, "consistent": true }],
			"@stylistic/object-curly-newline": ["error"],
			"@stylistic/array-bracket-newline": ["error", { "multiline": true }],
			"@stylistic/array-element-newline": ["error", "consistent"],
			"@stylistic/semi": ["error"],
			"@stylistic/space-before-blocks": ["error"],
			"@stylistic/space-before-function-paren": ["error", {"anonymous": "always", "named": "never", "asyncArrow": "always"}],
			"@stylistic/space-infix-ops": ["error"],
			"@stylistic/type-annotation-spacing": ["error"],
			"@stylistic/array-bracket-spacing": ["error"],
			"@stylistic/arrow-parens": ["error", "as-needed"],
			"@stylistic/arrow-spacing": ["error"]
		}
	}
];