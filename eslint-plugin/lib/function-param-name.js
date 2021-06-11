const FUNCTION_EXPRESSIONS = [
    'ArrowFunctionExpression',
    'FunctionExpression',
    'FunctionDeclaration',
    'MethodDefinition',
    'ClassProperty',
];

const defaultOptions = ['always', {
    minLength: 2,
    validNames: [],
    expressions: [],
}];

function getFunctionExpression(node) {
    return FUNCTION_EXPRESSIONS.includes(node.parent.type) ? node.parent : null;
}

function isValidArgument(node, [_, config]) {
    config = {
        ...defaultOptions[1],
        ...config,
    };

    return node.name.length >= config.minLength || config.validNames.includes(node.name);
}

function shouldValidateExpression(functionExpressionType, config) {
    config = {
        ...defaultOptions[1],
        ...config
    };

    if (!config.expressions.length) {
        return true;
    }

    return !config.expressions.includes(functionExpressionType)
}

function validateExpression(node, functionExpression, context) {
    functionExpression.params.forEach(param => {
        if (node === param) {
            if (!isValidArgument(node, context.options) && context.options[0] !== 'never') {
                context.report({
                    node,
                    messageId: 'variableNameTooShort',
                });
            }
        }
    });
}

module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Param\'s names of functions should be verbose',
            category: 'Stylistic Issues',
            recommended: false,
            url: 'https://github.com/glebmlk/eslint-plugin',
        },
        messages: {
            variableNameTooShort: 'Function param(s) name too short',
        },

        schema: [
            {
                enum: ['always', 'never']
            },
            {
                type: 'object',
                properties: {
                    minLength: {
                        type: 'number',
                        description: 'Minimum length of param\'s name, default is 2'
                    },
                    validNames: {
                        type: 'array',
                        description: 'Allowed param\'s names under minimum length, default is []',
                        items: {
                            type: 'string'
                        },
                        additionalItems: false
                    },
                    expressions: {
                        type: 'array',
                        description: 'List of expressions to validate, default is [] – all expressions are validated',
                        items: {
                            type: 'string',
                            enum: ['FunctionExpression', 'FunctionDeclaration', 'ArrowFunctionExpression', 'MethodDefinition', 'ClassProperty']
                        },
                        additionalItems: false
                    },
                },
                additionalProperties: false
            }
        ],
    },
    create(context) {
        return {
            Identifier(node) {
                const functionExpression = getFunctionExpression(node);

                if (!functionExpression) {
                    return;
                }

                switch (functionExpression.type) {
                    case 'ArrowFunctionExpression': {
                        if (shouldValidateExpression(functionExpression.type, context.options) && shouldValidateExpression(functionExpression.parent.type, context.options)) {
                            validateExpression(node, functionExpression, context)
                        }
                    } break;
                    case 'FunctionExpression': {
                        if (shouldValidateExpression(functionExpression.type, context.options) && shouldValidateExpression(functionExpression.parent.type)) {
                            validateExpression(node, functionExpression, context)
                        }
                    } break;
                    case 'FunctionDeclaration': {
                        if (shouldValidateExpression(functionExpression.type, context.options) && shouldValidateExpression(functionExpression.parent.type)) {
                            validateExpression(node, functionExpression, context)
                        }
                    } break;
                    case 'MethodDefinition': {
                        if (shouldValidateExpression(functionExpression.type, context.options)) {
                            validateExpression(node, functionExpression.value, context)
                        }
                    } break;
                    case 'ClassProperty': {
                        if (shouldValidateExpression(functionExpression.type, context.options)) {
                            validateExpression(node, functionExpression.value, context)
                        }
                    } break;
                }
            }
        };
    }
}