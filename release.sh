#!/bin/bash               # Specifies this is a bash script
git pull                  # Gets latest changes from remote repository

# Update changelog
echo update changelog
cd ./src/ng-select/       # Changes directory to ng-select
# Runs standard-version to update version numbers and changelog
node ../../node_modules/standard-version/bin/cli.js --infile ../../CHANGELOG.md
cd ../..                  # Returns to root directory

# Build libraries
echo build lib
yarn run build           # Builds both ng-select and ng-option-highlight libraries

# Push to git
echo push tags
git push --follow-tags origin master  # Pushes code and tags to master branch

# Publish to npm
echo push to npm
cp README.md ./dist/ng-select/        # Copies README to the distribution folder

# Publish ng-select
cd ./dist/ng-select/
yarn publish --access=public          # Publishes ng-select package to npm publicly

# Publish ng-option-highlight
cd ./dist/ng-option-highlight/
yarn publish --access=public          # Publishes ng-option-highlight package to npm publicly