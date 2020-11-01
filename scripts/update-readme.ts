import {promises as fs} from 'fs';
import * as path from 'path';

import {mmac} from 'make-me-a-content';

import prettier from 'prettier';

const prettierConfig = require('../prettier.config') as prettier.Options;

const PATHS = {
    readme: path.join(__dirname, '..', 'README.md'),
    rulesDir: path.join(__dirname, '..', 'src', 'rules'),
};

console.log(PATHS);

export async function updateReadme() {
    const rulesDirContents = (await fs.readdir(PATHS.rulesDir)).filter(
        x => x !== 'index.ts',
    );

    const rules = await Promise.all(
        rulesDirContents.map(dirName =>
            import(path.join(PATHS.rulesDir, dirName)).then(rule => ({
                rule: rule.default,
                dirName,
            })),
        ),
    );

    const rows = rules.map(
        ({rule, dirName}) =>
            `| [\`${rule.name}\`](./src/rules/${dirName}/readme.md) | ${
                rule.docs.description
            } | ${
                rule.defaultSetting ? JSON.stringify(rule.defaultSetting) : ' '
            } |`,
    );

    await mmac({
        updateScript: 'npm run updateDocs',
        filepath: PATHS.readme,
        lines: [
            '| rule name | description | default |',
            '| --- | --- | --- |',
            ...rows,
        ],
        id: 'rulestable',
        transform: content =>
            prettier.format(content, {parser: 'markdown', ...prettierConfig}),
    });

    console.log('✅readme is updated');
}

if (require.main === module) updateReadme();
