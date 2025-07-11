#!/bin/bash
RTSP_URL='rtsp://stream:$implepass1@192.168.8.40:554/unicast/c4/s0/live'
OUTPUT_DIR=$HOME/projects/mizan.2.0/pkgs/rtsp/streams
# AUDIO_OPTS="-c:a aac -b:a 160000 -ac 2"
# VIDEO_OPTS="-s 854x480 -c:v libx264 -b:v 800000"
# OUTPUT_HLS="-hls_time 10 -hls_list_size 10 -start_number 1"
# ffmpeg -i "$VIDSOURCE" -y $AUDIO_OPTS $VIDEO_OPTS $OUTPUT_HLS playlist.m3u8


# ffmpeg -fflags nobuffer \
# 	-v info -i \
# 	$RTSP_URL \
# 	-preset ultrafast \
# 	-tune zerolatency \
# 	-c:v copy \
# 	-pix_fmt yuv420p \
# 	-vcodec copy \
# 	-an \
# 	-movflags frag_keyframe+empty_moov \
# 	-vsync 0 \
# 	-flags -global_header \
# 	-hls_time 40 \
# 	-hls_list_size 2 \
# 	-hls_wrap 2 \
# 	-start_number 1 \
# 	$OUTPUT_DIR/4/video.m3u8

ffmpeg -fflags nobuffer \
 -rtsp_transport tcp \
 -i $RTSP_URL \
 -vsync 0 \
 -copyts \
 -vcodec copy \
 -movflags frag_keyframe+empty_moov \
 -an \
 -hls_flags delete_segments+append_list \
 -f segment \
 -segment_list_flags live \
 -segment_time 0.5 \
 -segment_list_size 1 \
 -segment_format mpegts \
 -segment_list $OUTPUT_DIR/4/index.m3u8 \
 -segment_list_type m3u8 \
 -segment_list_entry_prefix ./ \
 $OUTPUT_DIR/4/%3d.ts