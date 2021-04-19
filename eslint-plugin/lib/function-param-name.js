const FUNCTION_EXPRESSIONS = [
    'ArrowFunctionExpression',
    'FunctionExpression',
    'FunctionDeclaration'
]

const defaultOptions = ['always', {
    minLength: 4,
    validNames: []
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

module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Param\'s names of functions should be verbose',
            category: 'Stylistic Issues',
            recommended: false,
            url: '',
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
                        description: 'Minimum length of param\'s name, default is 4'
                    },
                    validNames: {
                        type: 'array',
                        description: 'Allowed param\'s names under minimum length, default is []',
                        items: {
                            type: 'string'
                        },
                        additionalItems: false
                    }
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
        };
    }
}