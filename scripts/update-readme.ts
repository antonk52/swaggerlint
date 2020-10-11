import {promises as fs} from 'fs';
import * as path from 'path';

import {mmac} from 'make-me-a-content';

import prettier from 'prettier';

const prettierConfig = require('../prettier.config') as prettier.Options;

async function updateReadme() {
    const rulesDirContents = (
        await fs.readdir(path.join(__dirname, '..', 'src', 'rules'))
    ).filter(x => x !== 'index.ts');

    const rules = await Promise.all(
        rulesDirContents.map(dirName =>
            import(path.join(__dirname, '..', 'src', 'rules', dirName)).then(
                rule => ({
                    rule: rule.default,
                    dirName,
                }),
            ),
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
        filepath: path.join(__dirname, '..', 'readme.md'),
        lines: [
            '| rule name | description | default |',
            '| --- | --- | --- |',
            ...rows,
        ],
        id: 'rulestable',
        comments: {},
        transform: content =>
            prettier.format(content, {parser: 'markdown', ...prettierConfig}),
    });

    console.log('✅readme is updated');
}

updateReadme();
