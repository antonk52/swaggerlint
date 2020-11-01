import {updateReadme} from './update-readme';
import {updateRules} from './update-rules';
import {updateTypes} from './update-types';

async function main() {
    const callbacks = [updateReadme, updateRules, updateTypes];

    for (let i = 0; i < callbacks.length; i++) {
        await callbacks[i]();
    }
}

main().catch(e => {
    process.stderr.write(`Unexpected error during content generation:\n${e}`);
    process.exit(1);
});
