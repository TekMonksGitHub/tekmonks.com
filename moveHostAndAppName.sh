#!/bin/sh

NEW_HOST=$1
NEW_APP=$2

grep $NEW_HOST -l -I -r . | xargs sed -i 's/$NEW_HOST/$NEW_HOST/g'

grep 'apps/tekmonks' -l -I -r . | xargs sed -i 's=apps/tekmonks=apps/tekmonks=g'
