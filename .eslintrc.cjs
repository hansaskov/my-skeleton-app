module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:svelte/recommended', 'prettier'],
	plugins: ['@typescript-eslint'],
	ignorePatterns: ['*.cjs'],
	parserOptions: {
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
		ecmaVersion: 2021,
		extraFileExtensions: ['*.svelte']
	},
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		},
		{
			files: ['*.ts'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				ecmaVersion: 2021,
				sourceType: 'module'
			},
			extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
			plugins: ['@typescript-eslint']
		}
	]
};
