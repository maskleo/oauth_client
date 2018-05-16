echo "Killing: `cat oauth2_client.pid`"
kill -9 `cat oauth2_client.pid`
rm -rf oauth2_client.pid