--
-- PostgreSQL database dump
--

\restrict ffVoaCLa8wCY918xxNTxfOLdmQMgqte0l7FhRkESwsD5kn2ZrVeUKWH8q1miEJV

-- Dumped from database version 14.20 (Homebrew)
-- Dumped by pg_dump version 14.20 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    id integer NOT NULL,
    user_id integer,
    name character varying(100) NOT NULL,
    type character varying(20) NOT NULL,
    balance numeric(15,2) DEFAULT 0.00,
    currency character varying(3) DEFAULT 'USD'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT accounts_type_check CHECK (((type)::text = ANY ((ARRAY['checking'::character varying, 'savings'::character varying, 'credit_card'::character varying, 'cash'::character varying, 'investment'::character varying])::text[])))
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accounts_id_seq OWNER TO postgres;

--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- Name: budgets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budgets (
    id integer NOT NULL,
    user_id integer,
    category_id integer,
    amount numeric(15,2) NOT NULL,
    period character varying(20) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT budgets_period_check CHECK (((period)::text = ANY ((ARRAY['monthly'::character varying, 'yearly'::character varying])::text[])))
);


ALTER TABLE public.budgets OWNER TO postgres;

--
-- Name: budgets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.budgets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.budgets_id_seq OWNER TO postgres;

--
-- Name: budgets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.budgets_id_seq OWNED BY public.budgets.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    user_id integer,
    name character varying(100) NOT NULL,
    type character varying(10) NOT NULL,
    color character varying(7) DEFAULT '#000000'::character varying,
    icon character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT categories_type_check CHECK (((type)::text = ANY ((ARRAY['income'::character varying, 'expense'::character varying])::text[])))
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    filename character varying(255) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: recurring_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recurring_transactions (
    id integer NOT NULL,
    user_id integer,
    account_id integer,
    category_id integer,
    amount numeric(15,2) NOT NULL,
    type character varying(10) NOT NULL,
    description text NOT NULL,
    frequency character varying(20) NOT NULL,
    next_date date NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT recurring_transactions_frequency_check CHECK (((frequency)::text = ANY ((ARRAY['daily'::character varying, 'weekly'::character varying, 'monthly'::character varying, 'yearly'::character varying])::text[]))),
    CONSTRAINT recurring_transactions_type_check CHECK (((type)::text = ANY ((ARRAY['income'::character varying, 'expense'::character varying])::text[])))
);


ALTER TABLE public.recurring_transactions OWNER TO postgres;

--
-- Name: recurring_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recurring_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recurring_transactions_id_seq OWNER TO postgres;

--
-- Name: recurring_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recurring_transactions_id_seq OWNED BY public.recurring_transactions.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    user_id integer,
    account_id integer,
    category_id integer,
    amount numeric(15,2) NOT NULL,
    type character varying(10) NOT NULL,
    description text,
    date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT transactions_type_check CHECK (((type)::text = ANY ((ARRAY['income'::character varying, 'expense'::character varying])::text[])))
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- Name: budgets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets ALTER COLUMN id SET DEFAULT nextval('public.budgets_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: recurring_transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_transactions ALTER COLUMN id SET DEFAULT nextval('public.recurring_transactions_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (id, user_id, name, type, balance, currency, created_at, updated_at) FROM stdin;
23	9	Octopus Card	cash	350.00	HKD	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
24	9	Hang Seng Bank Credit Card	credit_card	-1200.00	HKD	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
22	9	AlipayHK Wallet	savings	0.00	USD	2025-12-03 15:15:48.581953	2025-12-03 16:53:46.769583
21	9	HSBC Premier Account	checking	4000.00	HKD	2025-12-03 15:15:48.581953	2025-12-03 17:05:27.556832
20	9	Bank of China (HK) Savings	savings	9950.00	HKD	2025-12-03 15:15:48.581953	2025-12-03 17:05:44.2001
25	9	校园卡	checking	800.00	HKD	2025-12-03 16:54:26.126335	2025-12-03 17:12:28.990757
\.


--
-- Data for Name: budgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budgets (id, user_id, category_id, amount, period, start_date, end_date, created_at, updated_at) FROM stdin;
15	9	53	600.00	monthly	2025-11-30	2025-12-30	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
16	9	54	1000.00	monthly	2025-11-30	2025-12-30	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
17	9	55	400.00	monthly	2025-11-30	2025-12-30	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
18	9	56	300.00	monthly	2025-11-30	2025-12-30	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
19	9	57	500.00	monthly	2025-11-30	2025-12-30	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
20	9	58	200.00	monthly	2025-11-30	2025-12-30	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
21	9	59	300.00	monthly	2025-11-30	2025-12-30	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
24	9	55	1000.00	monthly	2025-12-02	2026-01-02	2025-12-03 17:41:22.802758	2025-12-03 17:41:30.494919
25	9	52	3000.00	monthly	2025-12-02	2026-01-02	2025-12-03 17:49:56.030913	2025-12-03 18:37:06.706437
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, user_id, name, type, color, icon, created_at) FROM stdin;
65	9	Salary	income	#74B9FF	💰	2025-12-03 17:49:56.027226
52	9	Food & Dining	expense	#FF6B6B	utensils	2025-12-03 15:15:48.581953
53	9	Transportation	expense	#4ECDC4	car	2025-12-03 15:15:48.581953
54	9	Shopping	expense	#95E77E	shopping-bag	2025-12-03 15:15:48.581953
55	9	Entertainment	expense	#FFE66D	gamepad-2	2025-12-03 15:15:48.581953
56	9	Education	expense	#A8DADC	book	2025-12-03 15:15:48.581953
57	9	Utilities	expense	#F4A261	home	2025-12-03 15:15:48.581953
58	9	Healthcare	expense	#E76F51	heart	2025-12-03 15:15:48.581953
59	9	Social	expense	#F72585	users	2025-12-03 15:15:48.581953
60	9	Monthly Allowance	income	#06FFA5	wallet	2025-12-03 15:15:48.581953
61	9	Part-time Job	income	#FFB700	briefcase	2025-12-03 15:15:48.581953
62	9	Scholarship	income	#00F5FF	award	2025-12-03 15:15:48.581953
63	9	Tutoring	income	#C77DFF	graduation-cap	2025-12-03 15:15:48.581953
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, filename, executed_at) FROM stdin;
1	001_create_tables.sql	2025-12-03 10:36:04.711055
\.


--
-- Data for Name: recurring_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recurring_transactions (id, user_id, account_id, category_id, amount, type, description, frequency, next_date, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, user_id, account_id, category_id, amount, type, description, date, created_at, updated_at) FROM stdin;
135	9	22	59	34.54	expense	Other expense	2025-12-02	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
136	9	24	57	267.98	expense	Water bill	2025-12-01	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
137	9	20	60	8000.00	income	Monthly allowance from parents	2025-11-30	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
138	9	23	53	21.42	expense	MTR to Admiralty	2025-11-30	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
139	9	23	52	35.75	expense	Late-night supper at Causeway Bay	2025-11-28	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
140	9	21	53	21.83	expense	MTR to Admiralty	2025-11-26	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
141	9	20	59	69.45	expense	Other expense	2025-11-24	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
142	9	24	54	303.32	expense	Stationery at Popular	2025-11-22	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
143	9	23	55	85.44	expense	Karaoke with classmates	2025-11-22	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
144	9	21	61	800.00	income	Part-time work at campus library	2025-11-20	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
145	9	24	54	479.23	expense	Skincare at SASA	2025-11-20	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
146	9	21	53	43.07	expense	MTR monthly pass top-up	2025-11-20	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
147	9	21	54	160.34	expense	Skincare at SASA	2025-11-19	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
148	9	24	57	269.24	expense	Home internet (PCCW)	2025-11-19	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
149	9	24	57	244.42	expense	Mobile phone bill (3HK)	2025-11-19	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
150	9	22	59	43.05	expense	Other expense	2025-11-18	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
151	9	23	53	27.65	expense	Bus to Kowloon Tong	2025-11-18	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
152	9	24	54	373.10	expense	Stationery at Popular	2025-11-18	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
153	9	21	58	108.99	expense	Other expense	2025-11-17	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
154	9	23	58	39.60	expense	Other expense	2025-11-16	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
155	9	22	59	39.28	expense	Other expense	2025-11-14	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
156	9	21	61	800.00	income	Part-time work at campus library	2025-11-13	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
157	9	22	56	124.01	expense	Workshop registration	2025-11-13	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
158	9	22	58	63.10	expense	Other expense	2025-11-13	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
159	9	22	53	52.87	expense	Taxi to Central	2025-11-13	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
160	9	22	56	335.48	expense	Course materials printing	2025-11-13	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
161	9	24	57	65.12	expense	Mobile phone bill (3HK)	2025-11-13	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
162	9	20	59	29.18	expense	Other expense	2025-11-12	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
163	9	20	58	32.77	expense	Other expense	2025-11-12	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
164	9	21	52	53.86	expense	Breakfast at campus café	2025-11-09	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
165	9	22	56	173.44	expense	Professional certification exam	2025-11-07	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
166	9	23	56	277.90	expense	Workshop registration	2025-11-07	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
167	9	21	61	800.00	income	Part-time work at campus library	2025-11-06	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
168	9	20	59	31.17	expense	Other expense	2025-11-06	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
169	9	23	58	118.04	expense	Other expense	2025-11-06	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
170	9	23	56	378.72	expense	Professional certification exam	2025-11-05	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
171	9	22	53	18.53	expense	Minibus to Sha Tin	2025-11-05	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
172	9	24	57	338.44	expense	Electricity bill	2025-11-01	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
173	9	20	60	8000.00	income	Monthly allowance from parents	2025-10-31	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
174	9	21	61	800.00	income	Part-time work at campus library	2025-10-30	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
175	9	21	52	37.17	expense	Dinner at Mong Kok restaurant	2025-10-30	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
176	9	24	57	218.37	expense	Water bill	2025-10-30	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
177	9	23	56	383.32	expense	Workshop registration	2025-10-29	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
178	9	24	57	327.39	expense	Electricity bill	2025-10-28	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
179	9	22	53	50.32	expense	MTR to Admiralty	2025-10-27	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
180	9	24	54	586.93	expense	Skincare at SASA	2025-10-25	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
181	9	20	59	49.26	expense	Other expense	2025-10-24	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
182	9	24	54	411.63	expense	Groceries at Wellcome超市	2025-10-24	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
183	9	21	61	800.00	income	Part-time work at campus library	2025-10-23	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
184	9	24	57	149.38	expense	Water bill	2025-10-22	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
185	9	23	54	222.68	expense	Groceries at Wellcome超市	2025-10-22	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
186	9	23	59	105.07	expense	Other expense	2025-10-21	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
187	9	20	52	60.66	expense	Bubble tea with friends	2025-10-21	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
188	9	23	53	42.41	expense	Bus to Kowloon Tong	2025-10-20	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
189	9	23	59	35.72	expense	Other expense	2025-10-17	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
190	9	21	61	800.00	income	Part-time work at campus library	2025-10-16	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
191	9	20	52	91.49	expense	Dinner at Mong Kok restaurant	2025-10-15	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
192	9	24	57	157.54	expense	Home internet (PCCW)	2025-10-15	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
193	9	21	56	154.87	expense	Course materials printing	2025-10-14	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
194	9	20	58	46.84	expense	Other expense	2025-10-11	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
195	9	21	53	31.75	expense	Taxi to Central	2025-10-11	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
196	9	20	54	112.49	expense	Groceries at Wellcome超市	2025-10-10	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
197	9	20	53	54.38	expense	Minibus to Sha Tin	2025-10-10	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
198	9	23	53	48.34	expense	Taxi to Central	2025-10-10	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
199	9	21	61	800.00	income	Part-time work at campus library	2025-10-09	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
200	9	21	59	76.14	expense	Other expense	2025-10-09	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
201	9	21	56	143.66	expense	Workshop registration	2025-10-09	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
202	9	20	59	34.67	expense	Other expense	2025-10-05	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
203	9	24	54	451.80	expense	Groceries at Wellcome超市	2025-10-05	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
204	9	21	61	800.00	income	Part-time work at campus library	2025-10-02	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
205	9	20	60	8000.00	income	Monthly allowance from parents	2025-09-30	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
206	9	20	52	50.00	expense	food	2025-12-03	2025-12-03 17:05:44.196575	2025-12-03 17:05:44.196575
207	9	20	52	45.00	expense	Lunch at CityU Canteen	2025-11-16	2025-12-03 17:49:56.033279	2025-12-03 17:49:56.033279
208	9	20	52	68.00	expense	Dinner at Café de Coral	2025-11-30	2025-12-03 17:49:56.034983	2025-12-03 17:49:56.034983
209	9	20	52	320.00	expense	Grocery Shopping at ParknShop	2025-11-24	2025-12-03 17:49:56.035594	2025-12-03 17:49:56.035594
210	9	20	53	480.00	expense	MTR Monthly Pass	2025-11-13	2025-12-03 17:49:56.036134	2025-12-03 17:49:56.036134
211	9	20	53	100.00	expense	Bus Top-up	2025-11-26	2025-12-03 17:49:56.036657	2025-12-03 17:49:56.036657
212	9	20	54	450.00	expense	New Shoes from Uniqlo	2025-11-26	2025-12-03 17:49:56.037209	2025-12-03 17:49:56.037209
213	9	20	55	120.00	expense	Movie Tickets	2025-11-15	2025-12-03 17:49:56.038009	2025-12-03 17:49:56.038009
214	9	20	55	78.00	expense	Netflix Subscription	2025-11-08	2025-12-03 17:49:56.039932	2025-12-03 17:49:56.039932
215	9	20	57	280.00	expense	Electricity Bill	2025-11-29	2025-12-03 17:49:56.040273	2025-12-03 17:49:56.040273
216	9	20	57	150.00	expense	Water Bill	2025-11-26	2025-12-03 17:49:56.041314	2025-12-03 17:49:56.041314
217	9	20	65	5000.00	income	Part-time Job Salary	2025-11-09	2025-12-03 17:49:56.041902	2025-12-03 17:49:56.041902
218	9	20	62	3000.00	income	CityU Scholarship	2025-11-12	2025-12-03 17:49:56.042337	2025-12-03 17:49:56.042337
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, first_name, last_name, created_at, updated_at) FROM stdin;
9	cityu boy	cityu.boy@cityu.edu.hk	$2a$10$jMoWX.Zp5oCrE8ex0Tf7oOZ5vQt5dgdDiXCxbQ7fh6ymkjFZssxQW	CityU	Student	2025-12-03 15:15:48.581953	2025-12-03 15:15:48.581953
\.


--
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accounts_id_seq', 25, true);


--
-- Name: budgets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.budgets_id_seq', 25, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 65, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, true);


--
-- Name: recurring_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recurring_transactions_id_seq', 4, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 218, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: budgets budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_filename_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_filename_key UNIQUE (filename);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: recurring_transactions recurring_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_transactions
    ADD CONSTRAINT recurring_transactions_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_accounts_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_accounts_user ON public.accounts USING btree (user_id);


--
-- Name: idx_budgets_user_period; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_budgets_user_period ON public.budgets USING btree (user_id, period);


--
-- Name: idx_transactions_account; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_account ON public.transactions USING btree (account_id);


--
-- Name: idx_transactions_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_category ON public.transactions USING btree (category_id);


--
-- Name: idx_transactions_user_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_user_date ON public.transactions USING btree (user_id, date DESC);


--
-- Name: accounts update_accounts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: budgets update_budgets_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: transactions update_transactions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: accounts accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: budgets budgets_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: budgets budgets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: categories categories_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: recurring_transactions recurring_transactions_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_transactions
    ADD CONSTRAINT recurring_transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: recurring_transactions recurring_transactions_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_transactions
    ADD CONSTRAINT recurring_transactions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: recurring_transactions recurring_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_transactions
    ADD CONSTRAINT recurring_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict ffVoaCLa8wCY918xxNTxfOLdmQMgqte0l7FhRkESwsD5kn2ZrVeUKWH8q1miEJV

