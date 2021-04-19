const RuleTester = require('eslint').RuleTester;
const rule = require('../lib/function-param-name');


RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 9,
    },
});

const ruleTester = new RuleTester();

ruleTester.run('function-param-name', rule, {
    valid: [
        'function f(first, second) {}',
        'var f = (first, second) => {}',
        {
            code: '[1, 2, 3].map(item => item * 10)',
            options: ['always', {validNames: ['item'], minLength: 5}]
        },
        {
            code: 'class A { method(someParam) {} }',
            options: ['always', {minLength: 6}]
        },
        {
            code: 'function f(arg) {}',
            options: ['never']
        },
        {
            code: 'let f = function(first, s) {}',
            options: ['always', {validNames: ['s']}]
        },
    ],
    invalid: [
        {
            code: '[1, 2, 3].map(m => m * 10)',
            errors: [{messageId: 'variableNameTooShort'}]
        },
        {
            code: 'function f(first, s) {}',
            errors: [{messageId: 'variableNameTooShort'}]
        },
        {
            code: '[1, 2, 3].map(item => item * 10).filter(f => f > 10)',
            errors: [{messageId: 'variableNameTooShort'}]
        },
        {
            code: '[1, 2, 3].map(item => item * 10)',
            options: ['always', {minLength: 5}],
            errors: [{messageId: 'variableNameTooShort'}]
        },
        {
            code: '[1, 2, 3].forEach(arg => {})',
            options: ['always', {minLength: 10}],
            errors: [{messageId: 'variableNameTooShort'}]
        },
        {
            code: 'let f = function(first, s) {}',
            errors: [{messageId: 'variableNameTooShort'}]
        },
        // {
        //     code: 'class A { method = (arg) => {} }',
        //     options: ['always', {minLength: 10}],
        //     errors: [{messageId: 'variableNameTooShort'}]
        // },
    ]
});