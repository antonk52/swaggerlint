import {promises as fs} from 'fs';
import * as path from 'path';
import Case from 'case';

import {mmac} from 'make-me-a-content';

import prettier from 'prettier';

const prettierConfig = require('../prettier.config') as prettier.Options;

async function updateRules() {
    const rulesDirContents = (
        await fs.readdir(path.join(__dirname, '..', 'src', 'rules'))
    ).filter(x => x !== 'index.ts');

    const imports = rulesDirContents.map(
        name => `import ${Case.camel(name)} from './${name}';`,
    );

    const objectProperties = rulesDirContents.map(
        name => `[${Case.camel(name)}.name]: ${Case.camel(name)},`,
    );

    await mmac({
        updateScript: 'npm run updateDocs',
        filepath: path.join(__dirname, '..', 'src', 'rules', 'index.ts'),
        lines: [
            ...imports,
            '',
            'export const rules: Record<string, SwaggerlintRule<string>> = {',
            ...objectProperties,
            '}',
        ],
        comments: {},
        transform: content =>
            prettier.format(content, {parser: 'babel', ...prettierConfig}),
    });

    console.log('✅rules are updated');
}

updateRules();
