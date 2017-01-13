# Test Api for node.js application
if [ -z "$1" ]; then
	exit
else
	echo "$1"
fi

if [ -e response.txt ]; then
	rm response.txt
fi

echo -------------------------------------------------------------
echo Testing $1 create (POST)...
echo -------------------------------------------------------------
curl -# -v -X POST http://127.0.0.1:1234/$1 -H "Content-Type:application/json" -d @$1_create.json -o response.txt