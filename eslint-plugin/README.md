Rules:
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