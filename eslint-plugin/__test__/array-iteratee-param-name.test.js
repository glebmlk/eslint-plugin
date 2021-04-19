const RuleTester = require('eslint').RuleTester;
const rule = require('../lib/array-iteratee-param-name');

RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 9,
    },
});

const makeValidTests = () => {
    return rule.ARRAY_METHODS_UNDER_LINT.map(method => {
        return [
            `[].${method}(argument => {})`,
            {
                code: `[].${method}(arg => {})`,
                options: ['never']
            },
            {
                code: `[].${method}(arg => {})`,
                options: ['always', {minLength: 3}]
            },
            {
                code: `[].${method}(i => {})`,
                options: ['always', {validNames: ['i']}]
            },
            `[].${method}(function(argument) {})`,
            {
                code: `[].${method}(function(arg) {})`,
                options: ['never']
            },
            {
                code: `[].${method}(function(arg) {})`,
                options: ['always', {minLength: 3}]
            },
            {
                code: `[].${method}(function(i) {})`,
                options: ['always', {validNames: ['i']}]
            },
        ]
    });
};
const makeInvalidTests = () => {
    return rule.ARRAY_METHODS_UNDER_LINT.map(method => {
        return [
            {
                code: `[].${method}(arg => {})`,
                errors: [{messageId: 'variableNameTooShort'}]
            },
            {
                code: `[].${method}(arg => {})`,
                options: ['always', {minLength: 10}],
                errors: [{messageId: 'variableNameTooShort'}]
            },

            ...(method === 'from' ? [
                    {
                        code: `[].${method}(23, (arg, index) => {})`,
                        errors: [{messageId: 'variableNameTooShort'}]
                    },
                ] : []
            ),

            ...(rule.ARRAY_METHODS_WITH_TWO_PARAMS_UNDER_LINT.includes(method) ? [
                    {
                        code: `[].${method}((arg, i) => {})`,
                        options: ['always', {validNames: ['i']}],
                        errors: [{messageId: 'variableNameTooShort'}]
                    },
                    {
                        code: `[].${method}(function(argument, i) {})`,
                        errors: [{messageId: 'variableNameTooShort'}]
                    },
                ] : []
            ),

            {
                code: `[].${method}(function(arg) {})`,
                errors: [{messageId: 'variableNameTooShort'}]
            },
        ]
    });
};
const ruleTester = new RuleTester();

ruleTester.run('array-iteratee-param-name', rule, {
    valid: makeValidTests().flat(),
    invalid: makeInvalidTests().flat(),
});