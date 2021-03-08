#!/bin/sh

NEW_HOST=$1
NEW_APP=$2

grep localhost -l -I -r . | xargs sed -i 's/localhost/$NEW_HOST/g'

grep 'apps/webscrolls' -l -I -r . | xargs sed -i 's=apps/webscrolls=$NEW_APP=g'

