module.exports = {
  root: true,

  settings: {
     // https://www.npmjs.com/package/eslint-import-resolver-typescript
    'import/resolver': {
      //? В связке с 'import/no-unresolved': 'error' помогает ts'у понимать какие пути на проекте корректные, а какие нет.
      typescript: {}
    }
  },

  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
  },
  
  extends: [
    'eslint:recommended',

     /**
     * * 'react-app' он же - eslint-config-react-app содержит в себе зависимости:
     * * @typescript-eslint/eslint-plugin
     * * @typescript-eslint/parser
     * * eslint-plugin-flowtype
     * * eslint-plugin-import
     * * eslint-plugin-jest
     * * eslint-plugin-jsx-a11y
     * * eslint-plugin-react
     * * eslint-plugin-react-hooks
     * * eslint-plugin-testing-library
     * ? И как я понимаю ими можно пользовать и НЕ ОБЯЗАТЕЛЬНО устанавливать их в свой package.json.
     * ? Изрядное количество правил уже прописано в 'react-app' однако можно воспользоваться плагинами из его зависимостей
     * ? Например добавить plugin:@typescript-eslint/all
     */

    'react-app', // https://github.com/facebook/create-react-app/blob/main/packages/eslint-config-react-app/README.md
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier'
  ],

  rules: {
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/no-empty-interface': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    'no-duplicate-imports': 'warn',
    // 'react/self-closing-comp': 'warn', //! Хотелось бы чтобы подобная опция включалась перед git commit'ом

    'import/no-unresolved': 'error',

    //https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',  //! path, fs
          'external', //! react, axios
          'internal', //! src/components
          'sibling',  //! ./foo or ./foo/bar
          'parent',   //! ../foo or ../../foo
          'index',    //! ./
          'type',     //! import type
          'unknown'
        ],

        /**
         * ? Когда мы определяем в PathGroups новый pattern И УКАЗЫВАЕМ position и добавляем его в какую-то группу, то каждый раз мы неявно создаем ещё одну! (из-за поля position)
         * * То есть если мы добавили два паттерна, в одну и ту же группу например 'external',
         * * по при 'newlines-between' = 'always', мы не сможем держать эти два типа импортов друг за другом
         * * будет требоваться строка между ними, как-будто это две разные группы!
         * * Этот недуг может устрановить свойство "distinctGroup" = false, но его ещё нет в текущей версии плагина.
         * * Поэтому ждём когда его добавят...
         */
        pathGroups: [
          /** 
          * ? Паттерны в целом нужно настраивать под себя относительно прописанных в alias webpack'a и paths tsconfiga...
          * * Примерно это может быть так
          * * @components/*
          * * @styles/*
          * * @images/*
          */
          {
            pattern: '*.module.+(css|scss)',
            group: 'unknown',
            patternOptions: { matchBase: true },
            position: 'after'
          },
          {
            pattern: '*.+(css|scss)',
            group: 'unknown',
            patternOptions: { matchBase: true },
            position: 'after'
          },
          {
            pattern: '*.+(jpg|png|gif|svg)',
            group: 'unknown',
            patternOptions: { matchBase: true },
            position: 'after'
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after'
          }
        ],

        pathGroupsExcludedImportTypes: [],
        warnOnUnassignedImports: true,
        'newlines-between': 'never',
        alphabetize: {
          order: 'desc',
          caseInsensitive: true
        }
      }
    ]
  }
}
