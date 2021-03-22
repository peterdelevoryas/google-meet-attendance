# google-meet-attendance

My mom is a public school music teacher and she doesn't do attendance during the
classes because it takes up too much time, so she looks at the logs afterwards
to mark attendance. Unfortunately, this requires going over csv files for every
meeting and analyzing each student chronologically, whereas the attendance
software is all sorted by grade and each student's last name.

This website offers an easy way to sort these Google Meet csv logs: you download
all your meeting logs, select them in the dropdown menu, and then it will
produce a single output csv file download `attendance.csv` that has all the data
sorted in a way that makes it much faster to examine attendance for each
student. Non-technical users can of course open attendance.csv in Google Sheets
and view the output that way.

(Right now each class's start time is hard-coded)
