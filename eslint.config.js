import js from '@eslint/js';
import globals from 'globals';
import hooks from 'eslint-plugin-react-hooks';
import a11y from 'eslint-plugin-jsx-a11y';
export default [{ignores:['dist/**','.ssr/**','node_modules/**','docs/**']},js.configs.recommended,{files:['**/*.{js,jsx,mjs}'],languageOptions:{globals:{...globals.browser,...globals.node},parserOptions:{ecmaFeatures:{jsx:true}}},plugins:{'react-hooks':hooks,'jsx-a11y':a11y},rules:{...hooks.configs.recommended.rules,...a11y.configs.recommended.rules,'no-unused-vars':['error',{varsIgnorePattern:'^(motion|[A-Z_])',argsIgnorePattern:'^_'}]}}];
