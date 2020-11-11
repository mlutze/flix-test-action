#!/bin/sh -l

flix_version="$1"
test_dir="$2"
fail_symbol="✗"

# make a temporary dir
mkdir tmp

# get the flix jar
curl -L "https://github.com/flix/flix/releases/download/$flix_version/flix.jar" --output flix.jar

# run tests and store the output
java -jar flix.jar --test "$test_dir"/**.flix | tee tmp/test-output

# check the output for errors
if grep fail_symbol tmp/test-output; then
    exit 1
else
    exit 0
fi
