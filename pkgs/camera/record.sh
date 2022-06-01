#!/bin/bash

U='stream'
P='$implepass1'
IP='192.168.8.40'
PORT='554'
CAMS=(2 5 6)

DIR="$HOME/.mizan/rec"


while true
do
	TS=`date "+%Y.%m.%d.%H.%M.%S"`

	for C in ${CAMS[@]}
	do
		mkdir -p $DIR/$C
		ffmpeg -y -i "rtsp://$U:$P@$IP:$PORT/unicast/c$C/s1/live" -frames:v 1 $DIR/$C/$TS.png || echo Capturing failed & 
	done

	sleep 1
done

exit 0
