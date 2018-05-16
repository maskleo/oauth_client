JAVA_OPTS="-Xms128m -Xmx256m"

echo "oauth2_client on...."

if find -name oauth2_client.pid | grep "oauth2_client.pid";
then
  echo "oauth2_client is running..."
  exit
fi

nohup java $JAVA_OPTS -jar oauth2_client-1.0-SNAPSHOT.jar >  output 2>&1 &

if [ ! -z "oauth2_client.pid" ]; then
  echo $!> oauth2_client.pid
fi