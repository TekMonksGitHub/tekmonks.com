#!/bin/sh

NEW_HOST=$1
NEW_APP=$2

grep 157.230.65.205 -l -I -r . | xargs sed -i 's/157.230.65.205/$NEW_HOST/g'

grep 'apps/tekmonks' -l -I -r . | xargs sed -i 's=apps/tekmonks=$NEW_APP=g'
