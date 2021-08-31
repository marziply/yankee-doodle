#!/bin/bash

node \
  --no-warnings \
  --experimental-json-modules \
  --experimental-vm-modules node_modules/jest/bin/jest.js \
  -c jest.config.json \
  $@
