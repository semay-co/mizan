#!/bin/bash

echo Src: $1
echo Dir: $2
echo File: $3

mkdir -p $2
ffmpeg -y -i $1 -frames:v 1 $2/$3 || echo Capturing failed

exit 0
