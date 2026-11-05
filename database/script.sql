create table autores (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	nacionalidade VARCHAR(50),
	data_nascimento DATE
)

create table livros(
	id serial primary key,
	titulo varchar(150) not null,
	genero varchar(50) not null,
	isbn varchar(20) unique  not null,
	edicao varchar(20) default 1,
	ano_publicacao integer not null,
	quantidade_total integer not null default 1 check(quantidade_total>=0),
	quantidade_disponivel integer not null default 1 check (quantidade_disponivel >= 0),
	autor_id integer not null references autores(id) on delete restrict,
	constraint ck_livros_disponivel check (quantidade_disponivel <= quantidade_total)
)

create table clientes (
	id serial primary key,
	nome varchar(100) not null,
	email varchar(100) unique not null,
	telefone varchar(20) unique not null,
	data_cadastro date not null default current_date
)

create table emprestimos (
	id serial primary key,
	cliente_id integer not null references clientes(id) on delete restrict,
	livro_id integer not null references livros(id) on delete restrict,
	data_emprestimo date not null default current_date,
	data_prevista_devolucao date not null,
	data_devolucao date,
	constraint ck_emprestimos_data check(data_prevista_devolucao >= data_emprestimo)
)