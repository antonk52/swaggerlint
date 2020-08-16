import * as assert from 'assert';
import {swaggerlint} from './swaggerlint';
import {getSwaggerObject, getOpenAPIObject} from './utils/tests';
import {
    Swagger,
    OpenAPI,
    SwaggerlintRule,
    SwaggerlintConfig,
    LintError,
} from './types';

type ValidSample<Schema> = {
    it: string;
    schema: Partial<Schema>;
    config?: SwaggerlintConfig;
}[];

type InvalidSample<Schema> = {
    it: string;
    schema: Partial<Schema>;
    config?: SwaggerlintConfig;
    errors: Partial<LintError>[];
}[];

type Item<T> = {
    valid: ValidSample<T>;
    invalid: InvalidSample<T>;
};

type Param = {
    rule: SwaggerlintRule<string>;
    swagger?: Item<Swagger.SwaggerObject>;
    openapi?: Item<OpenAPI.OpenAPIObject>;
};

export function ruleTester({rule, swagger}: Param): void {
    const defaultConfig = {
        rules: {[rule.name]: true},
    };
    describe(`rule: "${rule.name}"`, () => {
        if (swagger) {
            describe('swagger', () => {
                (swagger.valid || []).forEach(validSample => {
                    it(validSample.it, () => {
                        expect(
                            swaggerlint(
                                getSwaggerObject(validSample.schema),
                                validSample.config || defaultConfig,
                            ),
                        ).toEqual([]);
                    });
                });

                swagger.invalid.forEach(invalidSample => {
                    it(invalidSample.it, () => {
                        const result = swaggerlint(
                            getSwaggerObject(invalidSample.schema),
                            invalidSample.config || defaultConfig,
                        );

                        expect(result).toMatchObject(invalidSample.errors);
                    });
                });
            });
        }

        // if (Boolean(openapi)) {
        //     describe('openapi', () => {});
        // }
    });
}

export class RuleTester {
    rule: SwaggerlintRule<string>;
    defaultConfig: SwaggerlintConfig;

    constructor(rule: SwaggerlintRule<string>) {
        this.rule = rule;
        this.defaultConfig = {
            rules: {
                [rule.name]: true,
            },
        };
    }

    run({
        swagger,
        openapi,
    }: {
        swagger?: Item<Swagger.SwaggerObject>;
        openapi?: Item<OpenAPI.OpenAPIObject>;
    }) {
        const {defaultConfig} = this;

        function runTests(
            sample: Item<Swagger.SwaggerObject>,
            name: 'Swagger',
        ): void;
        function runTests(
            sample: Item<OpenAPI.OpenAPIObject>,
            name: 'OpenAPI',
        ): void;
        function runTests(
            sample: Item<Swagger.SwaggerObject | OpenAPI.OpenAPIObject>,
            name: 'Swagger' | 'OpenAPI',
        ): void {
            const makeSchema =
                name === 'Swagger' ? getSwaggerObject : getOpenAPIObject;

            describe(name, () => {
                describe('valid', () => {
                    sample.valid.forEach(valid => {
                        it(valid.it, () => {
                            expect(
                                swaggerlint(
                                    // @ts-expect-error: mom, typescript is merging arguments again
                                    makeSchema(valid.schema),
                                    valid.config || defaultConfig,
                                ),
                            ).toEqual([]);
                        });
                    });
                });

                describe('invalid', () => {
                    sample.invalid.forEach(invalid => {
                        it(invalid.it, () => {
                            const actual = swaggerlint(
                                // @ts-expect-error: mom, typescript is merging arguments again
                                makeSchema(invalid.schema),
                                invalid.config || defaultConfig,
                            );
                            const expected = invalid.errors;

                            if (actual.length !== expected.length) {
                                assert.fail(
                                    `Expected ${expected.length} error${
                                        expected.length === 1 ? '' : 's'
                                    } but got ${actual.length}`,
                                );
                            }
                            expect(actual).toMatchObject(expected);
                        });
                    });
                });
            });
        }

        describe(this.rule.name, () => {
            if (swagger) runTests(swagger, 'Swagger');
            if (openapi) runTests(openapi, 'OpenAPI');

            if (!swagger && !openapi)
                assert.fail(
                    'Neither swagger nor openapi was passed to RuleTester',
                );
        });
    }
}
