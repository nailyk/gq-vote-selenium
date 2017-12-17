#!/bin/bash
echo "date,score" > ./scores.csv
echo "Most Stylish Man : vote for Kanye West [Round 3 - GQ]"
while true
do
	VOTE_RESULT="$(ruby gq.rb 2> /dev/null)"
    if [ $? -eq 0 ]; then # random fails can occur with selenium
        echo "`date -u`,$VOTE_RESULT" | tee -a ./scores.csv
    else
        echo `date -u` "Vote did not happen for unexpected reasons"
    fi
done
