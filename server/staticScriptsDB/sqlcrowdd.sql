
ALTER DATABASE sqlcrowdd OWNER TO postgres;

CREATE TYPE public.enum_users_gender AS ENUM (
    'М',
    'Ж',
    'Не указано'
);

ALTER TYPE public.enum_users_gender OWNER TO postgres;

CREATE TYPE public.enum_users_role AS ENUM (
    'USER',
    'ADMIN'
);

ALTER TYPE public.enum_users_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE public.databases (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.databases OWNER TO postgres;

CREATE SEQUENCE public.databases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.databases_id_seq OWNER TO postgres;

ALTER SEQUENCE public.databases_id_seq OWNED BY public.databases.id;

CREATE TABLE public.solution_comments (
    id integer NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "solutionId" integer,
    "userId" integer
);

ALTER TABLE public.solution_comments OWNER TO postgres;

CREATE SEQUENCE public.solution_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.solution_comments_id_seq OWNER TO postgres;

ALTER SEQUENCE public.solution_comments_id_seq OWNED BY public.solution_comments.id;

CREATE TABLE public.solution_likes (
    id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "solutionId" integer,
    "userId" integer
);


ALTER TABLE public.solution_likes OWNER TO postgres;

CREATE SEQUENCE public.solution_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.solution_likes_id_seq OWNER TO postgres;

ALTER SEQUENCE public.solution_likes_id_seq OWNED BY public.solution_likes.id;

CREATE TABLE public.solutions (
    id integer NOT NULL,
    is_author boolean DEFAULT false,
    attempts integer DEFAULT 0,
    code character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "taskId" integer,
    "userId" integer,
    verified boolean DEFAULT false
);

ALTER TABLE public.solutions OWNER TO postgres;

CREATE SEQUENCE public.solutions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.solutions_id_seq OWNER TO postgres;

ALTER SEQUENCE public.solutions_id_seq OWNED BY public.solutions.id;

CREATE TABLE public.tasks (
    id integer NOT NULL,
    description character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer,
    "databaseId" integer,
    verified boolean DEFAULT false
);


ALTER TABLE public.tasks OWNER TO postgres;

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tasks_id_seq OWNER TO postgres;

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;

CREATE TABLE public.users (
    id integer NOT NULL,
    role public.enum_users_role DEFAULT 'USER'::public.enum_users_role,
    surname character varying(255),
    name character varying(255),
    patronymic character varying(255),
    gender public.enum_users_gender DEFAULT 'Не указано'::public.enum_users_gender,
    date_of_birth date,
    nickname character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

ALTER TABLE ONLY public.databases ALTER COLUMN id SET DEFAULT nextval('public.databases_id_seq'::regclass);

ALTER TABLE ONLY public.solution_comments ALTER COLUMN id SET DEFAULT nextval('public.solution_comments_id_seq'::regclass);

ALTER TABLE ONLY public.solution_likes ALTER COLUMN id SET DEFAULT nextval('public.solution_likes_id_seq'::regclass);

ALTER TABLE ONLY public.solutions ALTER COLUMN id SET DEFAULT nextval('public.solutions_id_seq'::regclass);

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

INSERT INTO public.databases (id, name, description, "createdAt", "updatedAt") VALUES (1, 'aero_pg_script', NULL, '2023-04-03 18:04:43.931+03', '2023-04-03 18:04:43.931+03');
INSERT INTO public.databases (id, name, description, "createdAt", "updatedAt") VALUES (2, 'computer_pg_script', NULL, '2023-04-03 18:04:44.132+03', '2023-04-03 18:04:44.132+03');
INSERT INTO public.databases (id, name, description, "createdAt", "updatedAt") VALUES (3, 'inc_out_pg_script', NULL, '2023-04-03 18:04:44.213+03', '2023-04-03 18:04:44.213+03');
INSERT INTO public.databases (id, name, description, "createdAt", "updatedAt") VALUES (4, 'painting_pg_script', NULL, '2023-04-03 18:04:44.303+03', '2023-04-03 18:04:44.303+03');
INSERT INTO public.databases (id, name, description, "createdAt", "updatedAt") VALUES (5, 'ships_pg_script', NULL, '2023-04-03 18:04:44.387+03', '2023-04-03 18:04:44.387+03');

INSERT INTO public.solution_comments (id, content, "createdAt", "updatedAt", "solutionId", "userId") VALUES (2, 'норма', '2023-04-08 23:04:25.017+03', '2023-04-08 23:04:25.017+03', 1, 2);
INSERT INTO public.solution_comments (id, content, "createdAt", "updatedAt", "solutionId", "userId") VALUES (3, 'как сдать курсач', '2023-04-08 23:05:40.122+03', '2023-04-08 23:05:40.122+03', 1, 2);
INSERT INTO public.solution_comments (id, content, "createdAt", "updatedAt", "solutionId", "userId") VALUES (4, 'Где найти работу??????', '2023-04-08 23:07:17.458+03', '2023-04-08 23:07:17.458+03', 1, 2);
INSERT INTO public.solution_comments (id, content, "createdAt", "updatedAt", "solutionId", "userId") VALUES (5, 'Я придуроккккк', '2023-04-08 23:10:09.589+03', '2023-04-08 23:10:09.589+03', 1, 2);
INSERT INTO public.solution_comments (id, content, "createdAt", "updatedAt", "solutionId", "userId") VALUES (6, '12345', '2023-04-19 14:49:04.982+03', '2023-04-19 14:49:04.982+03', 1, 1);
INSERT INTO public.solution_comments (id, content, "createdAt", "updatedAt", "solutionId", "userId") VALUES (21, 'Почему нельзя в двойных кавычках?', '2023-04-20 13:08:25.282+03', '2023-04-20 13:08:25.282+03', 27, 1);
INSERT INTO public.solution_comments (id, content, "createdAt", "updatedAt", "solutionId", "userId") VALUES (22, '21 апреля 2023 года', '2023-04-21 20:35:20.783+03', '2023-04-21 20:35:20.783+03', 35, 1);
INSERT INTO public.solution_comments (id, content, "createdAt", "updatedAt", "solutionId", "userId") VALUES (23, '1', '2023-04-21 20:35:51.6+03', '2023-04-21 20:35:51.6+03', 2, 1);
INSERT INTO public.solution_comments (id, content, "createdAt", "updatedAt", "solutionId", "userId") VALUES (24, 'привет', '2023-04-21 20:36:20.079+03', '2023-04-21 20:36:20.079+03', 2, 1);
INSERT INTO public.solution_comments (id, content, "createdAt", "updatedAt", "solutionId", "userId") VALUES (25, 'Поставьте, пожалуйста, моему сыну 5 за курсовую. программа прошла тестирование. ничего не сломалось.', '2023-04-21 20:50:34+03', '2023-04-21 20:50:34+03', 1, 2);
INSERT INTO public.solution_comments (id, content, "createdAt", "updatedAt", "solutionId", "userId") VALUES (26, 'Полностью согласен с комментатором выше))) Я очень старался, многое не получалось', '2023-04-21 21:05:57.982+03', '2023-04-21 21:05:57.982+03', 1, 1);
INSERT INTO public.solution_comments (id, content, "createdAt", "updatedAt", "solutionId", "userId") VALUES (27, 'Я сама составила эту задачу', '2023-04-21 21:23:08.51+03', '2023-04-21 21:23:08.51+03', 37, 2);
INSERT INTO public.solution_comments (id, content, "createdAt", "updatedAt", "solutionId", "userId") VALUES (28, 'Эх ты, лентяй, неправильно решил задачу.. У тебя обводка красная', '2023-04-21 21:29:12.964+03', '2023-04-21 21:29:12.964+03', 38, 2);

INSERT INTO public.solution_likes (id, "createdAt", "updatedAt", "solutionId", "userId") VALUES (4, '2023-04-09 10:26:06.954+03', '2023-04-09 10:26:06.954+03', 1, 2);
INSERT INTO public.solution_likes (id, "createdAt", "updatedAt", "solutionId", "userId") VALUES (27, '2023-04-21 20:33:59.812+03', '2023-04-21 20:33:59.812+03', 1, 1);
INSERT INTO public.solution_likes (id, "createdAt", "updatedAt", "solutionId", "userId") VALUES (29, '2023-04-21 20:34:50.555+03', '2023-04-21 20:34:50.555+03', 35, 1);
INSERT INTO public.solution_likes (id, "createdAt", "updatedAt", "solutionId", "userId") VALUES (33, '2023-04-21 21:47:03.991+03', '2023-04-21 21:47:03.991+03', 38, 2);

INSERT INTO public.solutions (id, is_author, attempts, code, "createdAt", "updatedAt", "taskId", "userId", verified) VALUES (4, true, 0, NULL, '2023-04-03 18:58:47.006+03', '2023-04-03 18:58:47.006+03', 4, 1, false);
INSERT INTO public.solutions (id, is_author, attempts, code, "createdAt", "updatedAt", "taskId", "userId", verified) VALUES (34, true, 13, 'SELECT code, inc from income where point=1', '2023-04-17 17:57:11.041+03', '2023-04-17 18:08:15.774+03', 14, 1, true);
INSERT INTO public.solutions (id, is_author, attempts, code, "createdAt", "updatedAt", "taskId", "userId", verified) VALUES (1, true, 107, 'select * from TRIP WHERE town_to = ''London''', '2023-04-03 18:46:47.475+03', '2023-04-18 14:04:55.274+03', 1, 1, true);
INSERT INTO public.solutions (id, is_author, attempts, code, "createdAt", "updatedAt", "taskId", "userId", verified) VALUES (3, true, 7, 'select * from outcome where point = 3', '2023-04-03 18:46:53.124+03', '2023-04-18 14:13:15.179+03', 3, 1, true);
INSERT INTO public.solutions (id, is_author, attempts, code, "createdAt", "updatedAt", "taskId", "userId", verified) VALUES (35, false, 4, 'select * 
from pc 
where price >=600 and price <=900', '2023-04-18 14:51:44.395+03', '2023-04-18 14:54:46.093+03', 2, 2, true);
INSERT INTO public.solutions (id, is_author, attempts, code, "createdAt", "updatedAt", "taskId", "userId", verified) VALUES (5, true, 4, 'SELECT * FROM classes where country=''USA''', '2023-04-05 11:57:30.948+03', '2023-04-19 21:00:12.98+03', 5, 2, true);
INSERT INTO public.solutions (id, is_author, attempts, code, "createdAt", "updatedAt", "taskId", "userId", verified) VALUES (36, false, 2, 'Select * FRoM classes where country=''USA''', '2023-04-19 20:55:23.33+03', '2023-04-19 21:00:58.388+03', 5, 1, true);
INSERT INTO public.solutions (id, is_author, attempts, code, "createdAt", "updatedAt", "taskId", "userId", verified) VALUES (27, false, 55, 'SELECT * From trip where town_to = ''London''', '2023-04-08 17:37:06.934+03', '2023-04-21 20:43:19.48+03', 1, 2, true);
INSERT INTO public.solutions (id, is_author, attempts, code, "createdAt", "updatedAt", "taskId", "userId", verified) VALUES (31, true, 0, NULL, '2023-04-17 13:31:13.17+03', '2023-04-17 13:31:13.17+03', 12, 1, false);
INSERT INTO public.solutions (id, is_author, attempts, code, "createdAt", "updatedAt", "taskId", "userId", verified) VALUES (32, true, 0, NULL, '2023-04-17 13:43:31.957+03', '2023-04-17 13:43:31.957+03', 6, 1, false);
INSERT INTO public.solutions (id, is_author, attempts, code, "createdAt", "updatedAt", "taskId", "userId", verified) VALUES (33, true, 2, 'SELECT name FROM company Where id_comp<=3', '2023-04-17 13:44:44.055+03', '2023-04-17 17:53:22.683+03', 13, 1, true);
INSERT INTO public.solutions (id, is_author, attempts, code, "createdAt", "updatedAt", "taskId", "userId", verified) VALUES (2, true, 1, 'SeLeCt * from pc where price BETWEEN 600 and 900', '2023-04-03 18:46:50.883+03', '2023-04-17 21:04:13.061+03', 2, 1, true);
INSERT INTO public.solutions (id, is_author, attempts, code, "createdAt", "updatedAt", "taskId", "userId", verified) VALUES (37, true, 8, 'select code, color, type, price 
FROM printer 
where price>=300 and type=''Laser'' and color=''n''', '2023-04-21 21:15:43.144+03', '2023-04-21 21:26:28.268+03', 11, 2, true);
INSERT INTO public.solutions (id, is_author, attempts, code, "createdAt", "updatedAt", "taskId", "userId", verified) VALUES (38, false, 1, 'SELECT * FROM PRINTER', '2023-04-21 21:26:54.715+03', '2023-04-21 21:27:45.106+03', 11, 1, false);

INSERT INTO public.tasks (id, description, "createdAt", "updatedAt", "userId", "databaseId", verified) VALUES (4, 'ccccc', '2023-04-03 18:58:46.968+03', '2023-04-03 18:58:46.968+03', 1, 4, false);
INSERT INTO public.tasks (id, description, "createdAt", "updatedAt", "userId", "databaseId", verified) VALUES (10, 'Новое описание', '2023-04-16 20:34:30.134+03', '2023-04-16 20:49:05.429+03', 2, NULL, false);
INSERT INTO public.tasks (id, description, "createdAt", "updatedAt", "userId", "databaseId", verified) VALUES (6, 'Вывести записи', '2023-04-07 15:01:12.905+03', '2023-04-16 16:05:18.594+03', 1, 1, false);
INSERT INTO public.tasks (id, description, "createdAt", "updatedAt", "userId", "databaseId", verified) VALUES (11, 'Выбрать принтеры ценой от 300 рублей, лазерные цвета n. Колонки code, color, type, price ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++', '2023-04-16 20:55:23.516+03', '2023-04-21 21:27:45.103+03', 2, 2, true);
INSERT INTO public.tasks (id, description, "createdAt", "updatedAt", "userId", "databaseId", verified) VALUES (3, 'Вывести все записи из таблицы outcome, у которых point равен 3', '2023-04-03 18:46:53.122+03', '2023-04-18 14:13:15.182+03', 1, 3, true);
INSERT INTO public.tasks (id, description, "createdAt", "updatedAt", "userId", "databaseId", verified) VALUES (2, 'Вывести все компы, стоимостью между 600 и 900', '2023-04-03 18:46:50.881+03', '2023-04-18 14:54:46.086+03', 1, 2, true);
INSERT INTO public.tasks (id, description, "createdAt", "updatedAt", "userId", "databaseId", verified) VALUES (7, 'Это какое-то описание задания', '2023-04-16 20:27:29.048+03', '2023-04-17 09:15:50.603+03', 1, 1, false);
INSERT INTO public.tasks (id, description, "createdAt", "updatedAt", "userId", "databaseId", verified) VALUES (12, 'Описание', '2023-04-17 12:46:44.557+03', '2023-04-17 13:28:33.516+03', 1, 1, false);
INSERT INTO public.tasks (id, description, "createdAt", "updatedAt", "userId", "databaseId", verified) VALUES (5, 'Вывести все классы, страна которых США', '2023-04-05 11:57:30.914+03', '2023-04-19 21:00:58.385+03', 2, 5, true);
INSERT INTO public.tasks (id, description, "createdAt", "updatedAt", "userId", "databaseId", verified) VALUES (1, 'Здесь надо выбрать все поездки с городом прибытия London. ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++', '2023-04-03 18:46:47.467+03', '2023-04-21 20:43:19.475+03', 1, 1, true);
INSERT INTO public.tasks (id, description, "createdAt", "updatedAt", "userId", "databaseId", verified) VALUES (13, 'ПРОВЕРКА: РЕШЕНИЯ АВТОРА?', '2023-04-17 13:43:56.893+03', '2023-04-17 17:22:15.82+03', 1, 1, false);
INSERT INTO public.tasks (id, description, "createdAt", "updatedAt", "userId", "databaseId", verified) VALUES (14, 'ЕЩЕ ОДНА ПРОВЕРКА', '2023-04-17 17:56:34.994+03', '2023-04-17 18:08:15.785+03', 1, 3, true);
INSERT INTO public.tasks (id, description, "createdAt", "updatedAt", "userId", "databaseId", verified) VALUES (8, NULL, '2023-04-16 20:28:16.912+03', '2023-04-16 20:28:16.912+03', 2, NULL, false);
INSERT INTO public.tasks (id, description, "createdAt", "updatedAt", "userId", "databaseId", verified) VALUES (9, NULL, '2023-04-16 20:33:55.303+03', '2023-04-16 20:33:55.303+03', 2, NULL, false);

INSERT INTO public.users (id, role, surname, name, patronymic, gender, date_of_birth, nickname, email, password, "createdAt", "updatedAt") VALUES (1, 'USER', 'Ткачёв', 'Сергей', 'Андреевич', 'М', '2001-08-31', 'serega', 's.tkachou01@gmail.com', '$2b$05$HW4ECg9fuQ10BsTYc12Hx.ejZrGS/Fr7nwhcKWKDk8wD0CV1VaXta', '2023-04-03 18:06:03.56+03', '2023-04-03 18:06:03.56+03');
INSERT INTO public.users (id, role, surname, name, patronymic, gender, date_of_birth, nickname, email, password, "createdAt", "updatedAt") VALUES (2, 'USER', 'Авсисевич', 'Галина', 'Адамовна', 'Ж', '1962-03-24', 'мама', 's.tkachou01@gmail.com1', '$2b$05$eChyAB3BxSiyUmaH6wtzseQ5PEIKkxDS/yBtuIo7bgXya4xrWrAPu', '2023-04-05 11:56:40.295+03', '2023-04-05 11:56:40.295+03');
INSERT INTO public.users (id, role, surname, name, patronymic, gender, date_of_birth, nickname, email, password, "createdAt", "updatedAt") VALUES (3, 'USER', NULL, NULL, NULL, 'Не указано', NULL, 'user', 'mail', '$2b$05$eJPJOtlMFBwL/sVZqmtQFugq8IPSJNKb61VJPI7j6CC3l3RvsYZQS', '2023-04-10 16:14:17.648+03', '2023-04-10 16:14:17.648+03');
INSERT INTO public.users (id, role, surname, name, patronymic, gender, date_of_birth, nickname, email, password, "createdAt", "updatedAt") VALUES (4, 'USER', 'фамилия', 'имя', 'отчество', 'Ж', '2001-08-31', 'никнейм', 'почта', '$2b$05$oel768Ovd5Pm2Ib2ZnTLYeUC1WVcfxzbOzGb6SPCUZnsjL6w3fp66', '2023-04-10 16:42:41.633+03', '2023-04-10 16:42:41.633+03');
INSERT INTO public.users (id, role, surname, name, patronymic, gender, date_of_birth, nickname, email, password, "createdAt", "updatedAt") VALUES (5, 'USER', NULL, NULL, 's.tkachou01@gmail.com', NULL, NULL, '1', '1', '$2b$05$7nbyOrbSD21YSP.hFf6rh.f0QCj96WXu9UlxlGoI54skjuYQhECsi', '2023-04-10 17:08:20.605+03', '2023-04-10 17:08:20.605+03');
INSERT INTO public.users (id, role, surname, name, patronymic, gender, date_of_birth, nickname, email, password, "createdAt", "updatedAt") VALUES (6, 'USER', NULL, NULL, '', 'Не указано', NULL, '12345', '12345', '$2b$05$k/U8pJfwphCfeVr4uv3Ak.Tj47cIQ.Fr7YmWfXAY9ivuYWzbQde.O', '2023-04-10 17:13:13.527+03', '2023-04-10 17:13:13.527+03');
INSERT INTO public.users (id, role, surname, name, patronymic, gender, date_of_birth, nickname, email, password, "createdAt", "updatedAt") VALUES (7, 'USER', '', '', '', 'Не указано', NULL, 'кто-то', '12', '$2b$05$sC5I.tkWvTuycWT206DaNuEFqwY/VOrVwa7hc/z65ym8W747TwffW', '2023-04-13 13:46:35.499+03', '2023-04-13 13:46:35.499+03');
INSERT INTO public.users (id, role, surname, name, patronymic, gender, date_of_birth, nickname, email, password, "createdAt", "updatedAt") VALUES (8, 'USER', '', '', '', 'Не указано', NULL, 'папа', 'a', '$2b$05$Qzhbp.zw1EhgT3KAahc2wu03B.iUirOeG0V4IA0/X6BFzSdGX/OZW', '2023-04-14 20:51:25.479+03', '2023-04-14 20:51:25.479+03');
INSERT INTO public.users (id, role, surname, name, patronymic, gender, date_of_birth, nickname, email, password, "createdAt", "updatedAt") VALUES (9, 'USER', '3', '4', '5', 'М', '2020-10-01', '2', '11', '$2b$05$vDgwPJNWJLVjpRja7AFWielZkNaN1ypnWZDZGhSfADH7wOv0CMRmu', '2023-04-14 21:03:25.717+03', '2023-04-14 21:03:25.717+03');
INSERT INTO public.users (id, role, surname, name, patronymic, gender, date_of_birth, nickname, email, password, "createdAt", "updatedAt") VALUES (10, 'USER', '22', '22', '22', 'Ж', '2015-01-20', '22', '22', '$2b$05$SwBnAjXquWFRLalPPVuzJe4uon83pgoBnUTRjlWPNuX01XBgt7Mx.', '2023-04-14 21:07:55.003+03', '2023-04-14 21:07:55.003+03');

SELECT pg_catalog.setval('public.databases_id_seq', 1, false);

SELECT pg_catalog.setval('public.solution_comments_id_seq', 28, true);

SELECT pg_catalog.setval('public.solution_likes_id_seq', 33, true);

SELECT pg_catalog.setval('public.solutions_id_seq', 38, true);

SELECT pg_catalog.setval('public.tasks_id_seq', 14, true);

SELECT pg_catalog.setval('public.users_id_seq', 10, true);

ALTER TABLE ONLY public.databases
    ADD CONSTRAINT databases_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.solution_comments
    ADD CONSTRAINT solution_comments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.solution_likes
    ADD CONSTRAINT solution_likes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.solutions
    ADD CONSTRAINT solutions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.solution_comments
    ADD CONSTRAINT "solution_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY public.solution_likes
    ADD CONSTRAINT "solution_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY public.solutions
    ADD CONSTRAINT "solutions_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY public.solutions
    ADD CONSTRAINT "solutions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES public.databases(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;