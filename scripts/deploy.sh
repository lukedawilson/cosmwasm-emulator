#!/usr/bin/env bash

# Remember to configure your ~/.aws/credentials file with the correct AWS access keys
# See https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html for details

set x
trap "exit" INT

if [ ! -d "dist" ]; then
    echo "${red}dist folder not found${reset}"
    exit 0;
fi

echo Synching dist Folder...
aws s3 sync dist/ s3://emulator.cosmwasm.net --delete --cache-control max-age=31536000,public

echo Invalidating cloudfront cache...
aws cloudfront create-invalidation --distribution-id E2BUXCZJ8XC5V4 --paths "/*"
