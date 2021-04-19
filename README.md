## Table of Contents

<!-- toc -->

-   [Install](#install)
-   [ESLint + Prettier](#eslint)

<!-- tocstop -->

## Install

Stable version

```
$ npm install eslint-plugin-function-expression --save-dev
```

## ESLint

This preset is compatible with any and ES Modules based project, written in `TypeScript` and/or `ES6+`. No matter is it `node`/`react` or `angular`.

Add following files in your project:

**`.eslintrc`**
```
    "plugins": ["function-expression"]
```

Current rules list:
* `array-iteratee-param-name`
    Validates length of iteratee function's params' names in array methods
    ```js
    // Iteratee param(s) name too short (at 1:15)
        [1, 2, 3].map(i => i * 10)
    // ---------------^
    ```
* `function-param-name` (unstable)
    Alike `array-iteratee-param-name` but validates length of params' names in any function expression, e.g.
    * Function expression `function(arg1, ...args) {}`
    * Function declaration `const f = function(arg1, ...args) {};`
    * Arrow function expression `const f = (arg1, ...args) => {};`
    * Class method `class A { method(arg1, ...args) {} }`
    * Class property with arrow function expression `class A { prop = (arg1, ...args) => {}; }`