#!/bin/bash
set -Ceu
###########################################################################
#
# Test Script to Test Node.js + MongoDB Application API 
# Note: Start MongoDB and nodejs app before testing
#
############################################################################
if [ -z "$1" ]; then
	echo "Please specify appointment, contact, note, or task"
	exit
else
	echo "$1"
fi

if [ -e response.txt ]; then
	rm response.txt
fi

echo -------------------------------------------------------------
echo "Testing $1 create (POST)..."
echo -------------------------------------------------------------
curl -# -v -X POST http://127.0.0.1:1234/$1 -H "Content-Type:application/json" -d @$1_create.json -o response.txt

ident=`cat response.txt`

echo
echo
echo -------------------------------------------------------------
echo "Testing $1 read (GET)..."
echo -------------------------------------------------------------
curl -# -v -X GET http://127.0.0.1:1234/$1/$ident

echo
echo
echo -------------------------------------------------------------
echo "Testing $1 get all..."
echo -------------------------------------------------------------
curl -# -v -X GET http://127.0.0.1:1234/$1

echo
echo
echo -------------------------------------------------------------
echo "Testing $1 update (PUT)..."
echo -------------------------------------------------------------
curl -# -v -X PUT http://127.0.0.1:1234/$1/$ident -H "Content-Type:application/json" -d @$1_update.json
curl -# -v -X GET http://127.0.0.1:1234/$1/$ident

echo
echo
echo -------------------------------------------------------------
echo "Testing $1 delete (DELETE)..."
echo -------------------------------------------------------------
curl -# -v -X DELETE http://127.0.0.1:1234/$1/$ident
curl -# -v -X GET http://127.0.0.1:1234/$1/$ident

echo "Test Completed !!"