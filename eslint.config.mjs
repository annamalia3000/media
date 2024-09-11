import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import jestPlugin from 'eslint-plugin-jest';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
    {
        ignores: [ 'dist/', '*.json' ], // Игнорирование папки dist и JSON файлов
    },
    {
        languageOptions: {
            parser: babelParser, // Использование парсера Babel
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    babelrc: false,
                    configFile: false,
                    presets: [ '@babel/preset-env' ], // Использование пресета Babel для ES2023
                },
            },
            ecmaVersion: 2023,
            sourceType: 'module',
            globals: {
                ...globals.browser, // Глобальные переменные браузера
                ...jestPlugin.environments.globals.globals, // Глобальные переменные для Jest
            },
        },
    },
    {
        files: [ '**/__tests__/**', '**/*.test.js' ], // Файлы тестов
        plugins: {
            jest: jestPlugin,
        },
        rules: {
            'jest/no-disabled-tests': 'off',
            'jest/no-focused-tests': 'off',
            'jest/no-identical-title': 'off',
            'jest/prefer-to-have-length': 'off',
            'jest/valid-expect': 'off',
            quotes: [ 'error', 'single', { avoidEscape: true, 
                allowTemplateLiterals: true } ], 
        },
    },
    {
        files: [ '**/*.js', '**/*.mjs' ], // Общее правило для всех JS файлов
        rules: {
            indent: [ 'error', 4 ], // Отступ 4 пробела
            semi: [ 'error', 'always' ], // Всегда использовать точку с запятой
            'no-unused-vars': 'off',
            'no-console': 'off',
            quotes: [ 'error', 'single', { avoidEscape: true, 
                allowTemplateLiterals: true } ],
        },
    },
    {
        files: [ '*.config.*' ], // Файлы конфигурации
        rules: {
            'no-underscore-dangle': [ 'off' ],
            'import/no-extraneous-dependencies': 'off',
        },
    },
    {
        plugins: {
            '@stylistic/js': stylisticJs,
        },
        rules: {
            'max-len': [ 'error', { code: 300 } ], // Максимальная длина строки 300 символов
            quotes: [ 'error', 'single', { avoidEscape: true, 
                allowTemplateLiterals: true } ],
            'object-property-newline': [ 'error' ],
            'array-bracket-spacing': [ 'error', 'always' ],
            'no-multiple-empty-lines': [ 'error', {
                max: 1,
                maxBOF: 1,
            } ],
        },
    },
];
