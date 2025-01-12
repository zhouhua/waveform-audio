import config from '@antfu/eslint-config';

export default config(
  {
    astro: false,
    formatters: {
      css: true,
      html: true,
    },
    ignores: ['.vscode/**/*', 'public/**/*', 'src-tauri/**/*', 'src/components/ui/**/*'],
    markdown: false,
    react: true,
    typescript: {
      overridesTypeAware: {
        'react/no-leaked-conditional-rendering': 'error',
      },
    },
    vue: false,
  },
  {
    rules: {
      'curly': ['error', 'all'],
      'eslint-comments/no-unlimited-disable': 'off',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'no-console': 'warn',
      'no-dupe-else-if': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'perfectionist/sort-classes': 'warn',
      'perfectionist/sort-enums': 'warn',
      'perfectionist/sort-intersection-types': 'warn',
      'perfectionist/sort-maps': 'warn',
      'perfectionist/sort-objects': 'warn',
      'perfectionist/sort-sets': 'warn',
      'perfectionist/sort-switch-case': 'warn',
      'perfectionist/sort-union-types': 'warn',
      'perfectionist/sort-variable-declarations': ['warn', {
        order: 'desc',
        partitionByNewLine: true,
        type: 'line-length',
      }],
      'react-dom/no-children-in-void-dom-elements': 'error',
      'react-dom/no-unsafe-target-blank': 'error',
      'react-hooks-extra/no-redundant-custom-hook': 'error',
      'react-hooks-extra/no-unnecessary-use-callback': 'error',
      'react-hooks-extra/no-unnecessary-use-memo': 'error',
      'react-hooks-extra/prefer-use-state-lazy-initialization': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-naming-convention/component-name': ['error', 'PascalCase'],
      'react-naming-convention/filename-extension': ['error', 'as-needed'],
      'react-refresh/only-export-components': 'off',
      'react/ensure-forward-ref-using-ref': 'error',
      'react/no-children-prop': 'error',
      'react/no-class-component': 'error',
      'react/no-clone-element': 'off',
      'react/no-comment-textnodes': 'error',
      'react/no-missing-component-display-name': 'error',
      'react/no-nested-components': 'error',
      'react/no-prop-types': 'error',
      'react/no-unstable-context-value': 'error',
      'react/no-useless-fragment': 'error',
      'regexp/confusing-quantifier': 'error',
      'regexp/grapheme-string-literal': 'error',
      'regexp/match-any': 'off',
      'regexp/optimal-quantifier-concatenation': ['error', {
        capturingGroups: 'ignore',
      }],
      'style/array-bracket-newline': ['error', 'consistent'],
      'style/array-element-newline': ['error', 'consistent'],
      'style/curly-newline': ['error', 'always'],
      'style/func-call-spacing': ['error', 'never'],
      'style/function-call-argument-newline': ['error', 'consistent'],
      'style/function-call-spacing': ['error', 'never'],
      'style/function-paren-newline': ['error', 'multiline-arguments'],
      'style/jsx-closing-bracket-location': ['error', 'line-aligned'],
      'style/jsx-closing-tag-location': ['error'],
      'style/jsx-curly-brace-presence': ['error', {
        children: 'never',
        propElementValues: 'always',
        props: 'never',
      }],
      'style/jsx-props-no-multi-spaces': 'error',
      'style/jsx-self-closing-comp': 'error',
      'style/jsx-sort-props': 'off',
      'style/max-len': ['error', {
        code: 120,
        comments: 120,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
        tabWidth: 2,
      }],
      'style/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        multilineDetection: 'brackets',
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      }],
      'style/multiline-ternary': ['error', 'always-multiline'],
      'style/no-confusing-arrow': 'warn',
      'style/no-extra-semi': 'error',
      'style/object-curly-newline': ['error', {
        consistent: true,
        multiline: true,
      }],
      'style/object-property-newline': ['error', {
        allowAllPropertiesOnSameLine: true,
      }],
      'style/one-var-declaration-per-line': 'warn',
      'style/semi': ['error', 'always'],
      'style/switch-colon-spacing': 'error',
      'ts/adjacent-overload-signatures': 'warn',
      'ts/array-type': ['error', {
        default: 'array',
        readonly: 'array',
      }],
      'unicorn/better-regex': 'warn',
      'unicorn/consistent-destructuring': 'warn',
      'unicorn/consistent-function-scoping': 'warn',
      'unicorn/filename-case': ['error', {
        case: 'kebabCase',
        ignore: [/\^$/, /^_index/],
      }],
      'unused-imports/no-unused-vars': ['error', {
        args: 'after-used',
        argsIgnorePattern: '^_',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
        vars: 'all',
        varsIgnorePattern: '^_',
      }],
    },
  },
);
