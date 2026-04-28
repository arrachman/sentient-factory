\set ON_ERROR_STOP on

\echo 'Running Sentient HR Attendance schema...'
\ir sentient_hr_attendance_01_schema.sql

\echo 'Running Sentient HR Attendance menu seed...'
\ir sentient_hr_attendance_02_menu_seed.sql

\echo 'Running Sentient HR Attendance minimal seed...'
\ir sentient_hr_attendance_03_seed_minimal.sql

\echo 'Running Sentient HR Attendance review schema...'
\ir sentient_hr_attendance_04_review_schema.sql

\echo 'Running Sentient HR Attendance review log schema...'
\ir sentient_hr_attendance_05_review_logs.sql

\echo 'Running Sentient HR Attendance face embedding schema...'
\ir sentient_hr_attendance_06_face_embedding_schema.sql

\echo 'Running Sentient HR Attendance demo users seed...'
\ir sentient_hr_attendance_07_demo_users.sql

\echo 'Running Sentient HR Attendance face enrollment uniqueness schema...'
\ir sentient_hr_attendance_08_face_enrollment_uniqueness.sql

\echo 'Running Sentient HR Attendance user worksites schema...'
\ir sentient_hr_attendance_09_user_worksites.sql

\echo 'Done.'
