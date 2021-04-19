const ARRAY_METHODS_UNDER_LINT = [
    'every',
    'filter',
    'find',
    'findIndex',
    'flatMap',
    'forEach',
    'from', // callback is second arg
    'map',
    'reduce', // validate 0 and 1 param
    'reduceRight', // validate 0 and 1 param
    'some',
    'sort', // validate 0 and 1 param
];

const ARRAY_METHODS_WITH_TWO_PARAMS_UNDER_LINT = [
    'reduce',
    'reduceRight',
    'sort'
];

const defaultOptions = ['always', {
    minLength: 4,
    validNames: []
}];

function getFunctionExpression(node) {
    let parent = node.parent;

    if (['ArrowFunctionExpression', 'FunctionExpression'].includes(parent.type)) {
        parent = parent.parent;

        if (parent.callee && parent.callee.type === 'MemberExpression') {
            return parent.callee;
        }
    }

    return null;
}

function isValidArgument(node, [_, config]) {
    config = {
        ...defaultOptions[1],
        ...config,
    };

    return node.name.length >= config.minLength || config.validNames.includes(node.name);
}

function isParamAt(node, params, index) {
    return node === params[index];
}

module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Param\'s names of array iteratee should be verbose',
            category: 'Stylistic Issues',
            recommended: false,
            url: '',
        },
        messages: {
            variableNameTooShort: 'Iteratee param(s) name too short',
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

                if (ARRAY_METHODS_UNDER_LINT.includes(functionExpression.property.name)) {
                    if (ARRAY_METHODS_WITH_TWO_PARAMS_UNDER_LINT.includes(functionExpression.property.name)) {
                        if (
                            (isParamAt(node, node.parent.params, 0) || isParamAt(node, node.parent.params, 1)) &&
                            !isValidArgument(node, context.options) && context.options[0] !== 'never'
                        ) {
                            context.report({
                                node,
                                messageId: 'variableNameTooShort',
                            });
                        }
                    } else {
                        if (isParamAt(node, node.parent.params, 0) && !isValidArgument(node, context.options) && context.options[0] !== 'never') {
                            context.report({
                                node,
                                messageId: 'variableNameTooShort',
                            });
                        }
                    }
                }
            }
        };
    },
    ARRAY_METHODS_UNDER_LINT,
    ARRAY_METHODS_WITH_TWO_PARAMS_UNDER_LINT,
}