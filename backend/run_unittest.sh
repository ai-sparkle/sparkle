#!/usr/bin/env sh
export PYTHONPATH=~/projects:$PYTHONPATH
# python -m unittest discover -s . -p '*_test.py'

if [ "$#" -eq 1 ]; then
    echo "Running unittest ${1}..."
    python -m unittest discover -s . -p $1
else
    python -m unittest discover -s . -p '*_test.py'
fi
