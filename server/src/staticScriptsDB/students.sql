CREATE TABLE Students
(
student_id int NOT NULL ,
student_name varchar(50) NOT NULL ,
student_surname varchar(50) NOT NULL ,
student_gender varchar(1) NOT NULL ,
student_age int NOT NULL ,
student_country varchar(50) NOT NULL ,
student_email varchar(255) ,
group_id int NOT NULL
);

CREATE TABLE StudentGroups (
group_id int NOT NULL,
group_name varchar(10) NOT NULL,
curator_id int NOT NULL,
faculty_id int NOT NULL,
semester_id int NOT NULL
);

CREATE TABLE Teachers
(
teacher_id int NOT NULL ,
teacher_name varchar(50)NOT NULL ,
teacher_surname varchar(50)NOT NULL ,
teacher_middle_name varchar(50)
);

CREATE TABLE Disciplines
(
discipline_id int NOT NULL ,
discipline_name varchar(255)NOT NULL ,
faculty_id int NOT NULL ,
teacher_id int NOT NULL
);

CREATE TABLE Exams
(
exam_id int NOT NULL ,
room_number varchar(6) ,
session_id int NOT NULL,
discipline_id int NOT NULL
);

CREATE TABLE Sessions
(
session_id int NOT NULL ,
session_start_date date NOT NULL ,
session_end_date date NOT NULL ,
group_id int NOT NULL ,
semester_id int NOT NULL
);

CREATE TABLE Semesters
(
semester_id int NOT NULL ,
semester_number int NOT NULL
);

CREATE TABLE Faculties
(
faculty_id int NOT NULL ,
faculty_name varchar(255) NOT NULL
);

CREATE TABLE OldFaculties
(
old_faculty_id int NOT NULL ,
old_faculty_name varchar(255) NOT NULL
);

CREATE TABLE Contests
(
contest_id int NOT NULL ,
contest_name varchar(255) NOT NULL ,
contest_date date NOT NULL
);

CREATE TABLE Participants
(
participant_id int NOT NULL ,
contest_id int NOT NULL ,
student_id int NOT NULL ,
first_round_points int ,
second_round_points int
);

CREATE TABLE Grades
(
grade_id int NOT NULL ,
grade_value int NOT NULL ,
student_id int NOT NULL ,
exam_id int NOT NULL
);

ALTER TABLE Students ADD PRIMARY KEY (student_id);
ALTER TABLE StudentGroups ADD PRIMARY KEY (group_id);
ALTER TABLE Teachers ADD PRIMARY KEY (teacher_id);
ALTER TABLE Disciplines ADD PRIMARY KEY (discipline_id);
ALTER TABLE Exams ADD PRIMARY KEY (exam_id);
ALTER TABLE Sessions ADD PRIMARY KEY (session_id);
ALTER TABLE Semesters ADD PRIMARY KEY (semester_id);
ALTER TABLE Faculties ADD PRIMARY KEY (faculty_id);
ALTER TABLE Contests ADD PRIMARY KEY (contest_id);
ALTER TABLE Participants ADD PRIMARY KEY (participant_id);
ALTER TABLE Grades ADD PRIMARY KEY (grade_id);

ALTER TABLE Students ADD CONSTRAINT FK_Students_StudentGroups FOREIGN KEY (group_id) REFERENCES StudentGroups (group_id);
ALTER TABLE StudentGroups ADD CONSTRAINT FK_StudentGroups_Teachers FOREIGN KEY (curator_id) REFERENCES Teachers (teacher_id);
ALTER TABLE StudentGroups ADD CONSTRAINT FK_StudentGroups_Faculties FOREIGN KEY (faculty_id) REFERENCES Faculties (faculty_id);
ALTER TABLE StudentGroups ADD CONSTRAINT FK_StudentGroups_Semesters FOREIGN KEY (semester_id) REFERENCES Semesters (semester_id);
ALTER TABLE Disciplines ADD CONSTRAINT FK_Disciplines_Teachers FOREIGN KEY (teacher_id) REFERENCES Teachers (teacher_id);
ALTER TABLE Disciplines ADD CONSTRAINT FK_Disciplines_Faculties FOREIGN KEY (faculty_id) REFERENCES Faculties (faculty_id);
ALTER TABLE Exams ADD CONSTRAINT FK_Exams_Sessions FOREIGN KEY (session_id) REFERENCES Sessions (session_id);
ALTER TABLE Exams ADD CONSTRAINT FK_Exams_Disciplines FOREIGN KEY (discipline_id) REFERENCES Disciplines (discipline_id);
ALTER TABLE Sessions ADD CONSTRAINT FK_Sessions_StudentGroups FOREIGN KEY (group_id) REFERENCES StudentGroups (group_id);
ALTER TABLE Sessions ADD CONSTRAINT FK_Sessions_Semesters FOREIGN KEY (semester_id) REFERENCES Semesters (semester_id);
ALTER TABLE Participants ADD CONSTRAINT FK_Participants_Contests FOREIGN KEY (contest_id) REFERENCES Contests (contest_id);
ALTER TABLE Participants ADD CONSTRAINT FK_Participants_Students FOREIGN KEY (student_id) REFERENCES Students (student_id);
ALTER TABLE Grades ADD CONSTRAINT FK_Grades_Exams FOREIGN KEY (exam_id) REFERENCES Exams (exam_id);
ALTER TABLE Grades ADD CONSTRAINT FK_Grades_Students FOREIGN KEY (student_id) REFERENCES Students (student_id);

INSERT INTO Semesters(semester_id, semester_number)
VALUES(1, '1');
INSERT INTO Semesters(semester_id, semester_number)
VALUES(5, '5');
INSERT INTO Semesters(semester_id, semester_number)
VALUES(7, '7');

INSERT INTO Faculties(faculty_id, faculty_name)
VALUES(7, 'Компьютерных технологий');
INSERT INTO Faculties(faculty_id, faculty_name)
VALUES(3, 'Журналистика');

INSERT INTO OldFaculties(old_faculty_id, old_faculty_name)
VALUES(5, 'Исторический');
INSERT INTO OldFaculties(old_faculty_id, old_faculty_name)
VALUES(8, 'Химический');

INSERT INTO Teachers(teacher_id, teacher_surname, teacher_name, teacher_middle_name)
VALUES(860, 'Смирнов', 'Евгений', 'Андреевич');
INSERT INTO Teachers(teacher_id, teacher_surname, teacher_name, teacher_middle_name)
VALUES(778, 'Игнатьева', 'Екатерина', 'Михайловна');
INSERT INTO Teachers(teacher_id, teacher_surname, teacher_name, teacher_middle_name)
VALUES(891, 'Колесникова', 'Марина', 'Викторовна');
INSERT INTO Teachers(teacher_id, teacher_surname, teacher_name, teacher_middle_name)
VALUES(1003, 'Донских', 'Иван', 'Геннадьевич');
INSERT INTO Teachers(teacher_id, teacher_surname, teacher_name, teacher_middle_name)
VALUES(1025, 'Потапова', 'Мария', 'Андреевна');
INSERT INTO Teachers(teacher_id, teacher_surname, teacher_name, teacher_middle_name)
VALUES(918, 'Ростовская', 'Ангелина', 'Анатольевна');
INSERT INTO Teachers(teacher_id, teacher_surname, teacher_name, teacher_middle_name)
VALUES(936, 'Спрут', 'Олег', 'Иванович');
INSERT INTO Teachers(teacher_id, teacher_surname, teacher_name, teacher_middle_name)
VALUES(919, 'Ростовский', 'Дмитрий', 'Анатольевич');

INSERT INTO Disciplines(discipline_id, discipline_name, faculty_id, teacher_id)
VALUES(48, 'Философия', 7, 860);
INSERT INTO Disciplines(discipline_id, discipline_name, faculty_id, teacher_id)
VALUES(13, 'Технологии программирования', 7, 778);
INSERT INTO Disciplines(discipline_id, discipline_name, faculty_id, teacher_id)
VALUES(8, 'Математический анализ', 7, 891);
INSERT INTO Disciplines(discipline_id, discipline_name, faculty_id, teacher_id)
VALUES(10, 'Объектно-ориентированное программирование', 7, 891);
INSERT INTO Disciplines(discipline_id, discipline_name, faculty_id, teacher_id)
VALUES(35, 'Теория информации', 7, 1003);
INSERT INTO Disciplines(discipline_id, discipline_name, faculty_id, teacher_id)
VALUES(16, 'Компьютерная геометрия и графика', 7, 1025);
INSERT INTO Disciplines(discipline_id, discipline_name, faculty_id, teacher_id)
VALUES(24, 'Статистика', 7, 918);
INSERT INTO Disciplines(discipline_id, discipline_name, faculty_id, teacher_id)
VALUES(40, 'Дифференциальная геометрия', 7, 936);
INSERT INTO Disciplines(discipline_id, discipline_name, faculty_id, teacher_id)
VALUES(33, 'История', 7, 919);
INSERT INTO Disciplines(discipline_id, discipline_name, faculty_id, teacher_id)
VALUES(34, 'История', 3, 919);
INSERT INTO Disciplines(discipline_id, discipline_name, faculty_id, teacher_id)
VALUES(27, 'Социология', 3, 919);

INSERT INTO StudentGroups(group_id, group_name, curator_id, faculty_id, semester_id)
VALUES(31548,'304F', 1025, 7, 5);
INSERT INTO StudentGroups(group_id, group_name, curator_id, faculty_id, semester_id)
VALUES(33018,'580Z', 778, 3, 1);
INSERT INTO StudentGroups(group_id, group_name, curator_id, faculty_id, semester_id)
VALUES(30913,'117F', 1003, 7, 7);

INSERT INTO Students(student_id, student_name, student_surname, student_gender, student_age, student_email, student_country, group_id)
VALUES(92571, 'Аркадий', 'Петрашевский', 'M', 22, 'a_pet@mail.ru(link sends e-mail)', 'РФ', 31548);
INSERT INTO Students(student_id, student_name, student_surname, student_gender, student_age, student_email, student_country, group_id)
VALUES(92522, 'Эра', 'Сейдинай', 'F', 25, 'seydinay345@mail.ru(link sends e-mail)', 'Албания', 31548);
INSERT INTO Students(student_id, student_name, student_surname, student_gender, student_age, student_email, student_country, group_id)
VALUES(92435, 'Зинаида', 'Егорова', 'F', 19, 'zin-zin-eh@mail.ru(link sends e-mail)', 'РФ', 30913);
INSERT INTO Students(student_id, student_name, student_surname, student_gender, student_age, student_email, student_country, group_id)
VALUES(92540, 'Пётр', 'Адамченко', 'M', 21, NULL, 'Украина', 31548);
INSERT INTO Students(student_id, student_name, student_surname, student_gender, student_age, student_email, student_country, group_id)
VALUES(92415, 'Базиль', 'Легран', 'M', 24, 'b.l@mail.ru(link sends e-mail)', 'Франция', 30913);
INSERT INTO Students(student_id, student_name, student_surname, student_gender, student_age, student_email, student_country, group_id)
VALUES(92526, 'Еагений', 'Распопов', 'M', 22, 'evgeniy_ras@mail.ru(link sends e-mail)', 'РФ', 31548);
INSERT INTO Students(student_id, student_name, student_surname, student_gender, student_age, student_email, student_country, group_id)
VALUES(92527, 'Дмитрий', 'Колобков', 'M', 22, 'kolodm@mail.ru(link sends e-mail)', 'РФ', 31548);
INSERT INTO Students(student_id, student_name, student_surname, student_gender, student_age, student_email, student_country, group_id)
VALUES(92518, 'Ольга', 'Шульгина', 'F', 23, 'shulginaa@mail.ru(link sends e-mail)', 'РФ', 31548);
INSERT INTO Students(student_id, student_name, student_surname, student_gender, student_age, student_email, student_country, group_id)
VALUES(92599, 'Григорий', 'Римский', 'M', 21, NULL, 'РФ', 33018);
INSERT INTO Students(student_id, student_name, student_surname, student_gender, student_age, student_email, student_country, group_id)
VALUES(92410, 'Вадим', 'Грошев', 'M', 20, 'vadim1881@mail.ru(link sends e-mail)', 'РФ', 30913);

INSERT INTO Sessions(session_id, session_start_date, session_end_date, group_id, semester_id)
VALUES(2350, '2020-12-27', '2021-02-22', 33018, 1);
INSERT INTO Sessions(session_id, session_start_date, session_end_date, group_id, semester_id)
VALUES(2442, '2020-12-27', '2021-02-28', 31548, 5);
INSERT INTO Sessions(session_id, session_start_date, session_end_date, group_id, semester_id)
VALUES(2413, '2020-12-25', '2021-02-22', 30913, 7);

INSERT INTO Exams(exam_id, room_number, session_id, discipline_id)
VALUES(20005, '201', 2350, 33);
INSERT INTO Exams(exam_id, room_number, session_id, discipline_id)
VALUES(20006, '325', 2350, 27);
INSERT INTO Exams(exam_id, room_number, session_id, discipline_id)
VALUES(20118, '104', 2442, 48);
INSERT INTO Exams(exam_id, room_number, session_id, discipline_id)
VALUES(20119, '3', 2442, 13);
INSERT INTO Exams(exam_id, room_number, session_id, discipline_id)
VALUES(20120, '115', 2442, 8);
INSERT INTO Exams(exam_id, room_number, session_id, discipline_id)
VALUES(20121, '408', 2442, 35);
INSERT INTO Exams(exam_id, room_number, session_id, discipline_id)
VALUES(20152, '115', 2413, 8);
INSERT INTO Exams(exam_id, room_number, session_id, discipline_id)
VALUES(20154, '408', 2413, 10);
INSERT INTO Exams(exam_id, room_number, session_id, discipline_id)
VALUES(20155, '104', 2413, 16);
INSERT INTO Exams(exam_id, room_number, session_id, discipline_id)
VALUES(20156, '213', 2413, 48);
INSERT INTO Exams(exam_id, room_number, session_id, discipline_id)
VALUES(20157, '104', 2413, 33);

-- ----------------------
INSERT INTO Contests(contest_id, contest_name, contest_date)
VALUES(165, 'Фотовыставка Технологии будущего', '2020-10-25');

INSERT INTO Participants(participant_id, contest_id, student_id, first_round_points, second_round_points)
VALUES(2214, 165, 92540, 148, 115);
INSERT INTO Participants(participant_id, contest_id, student_id, first_round_points, second_round_points)
VALUES(2215, 165, 92526, 13, 36);
INSERT INTO Participants(participant_id, contest_id, student_id, first_round_points, second_round_points)
VALUES(2216, 165, 92518, 103, 59);
INSERT INTO Participants(participant_id, contest_id, student_id, first_round_points, second_round_points)
VALUES(2217, 165, 92522, 95, 124);
INSERT INTO Participants(participant_id, contest_id, student_id, first_round_points, second_round_points)
VALUES(2218, 165, 92435, 65, 89);

INSERT INTO Grades(grade_id, grade_value, student_id, exam_id)
VALUES(34221, 3, 92571, 20119);
INSERT INTO Grades(grade_id, grade_value, student_id, exam_id)
VALUES(34255, 4, 92571, 20154);
INSERT INTO Grades(grade_id, grade_value, student_id, exam_id)
VALUES(34567, 5, 92571, 20006);
INSERT INTO Grades(grade_id, grade_value, student_id, exam_id)
VALUES(34788, 4, 92522, 20119);
INSERT INTO Grades(grade_id, grade_value, student_id, exam_id)
VALUES(34579, 3, 92435, 20119);