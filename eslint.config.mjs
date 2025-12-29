import config from 'eslint-config-xo';
import {defineConfig} from 'eslint/config';

export default defineConfig([
	config,
 	{
		languageOptions: {
			sourceType: 'commonjs',
		},
		rules: {
			"new-cap": "off",
			"curly": "off",
			"camelcase": "off",
			"json/no-empty-keys": "off",
			"no-undef": "off",
		},
	},
	
]);