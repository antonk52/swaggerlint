#!/usr/bin/env bash

npm run update-all-files

if [[ $(git status -s) ]]; then
    echo 'there are unstaged changes, update all files locally and commit them\n'
    exit 1
else
    exit 0
fi
