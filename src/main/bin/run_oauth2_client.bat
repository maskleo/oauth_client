@echo on
CHCP 65001
title oauth2_client
echo "oauth2_client on...."
java -Dfile.encoding=utf-8 -jar oauth2_client-1.0-SNAPSHOT.jar
pause
:end