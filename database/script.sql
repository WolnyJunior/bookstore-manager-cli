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
	ano_publicacao integer,
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

-- Inserindo dados de teste
INSERT INTO autores (nome, nacionalidade, data_nascimento) VALUES
 ('Fernando Pessoa','Portuguesa','1888-06-13'),
 ('Stephen King','Estadunidense','1947-09-21'),
 ('J. R. R. Tolkien','Britânica','1892-01-03'),
 ('George Orwell','Britânica','1903-06-25'),
 ('Antoine de Saint-Exupéry','Francesa','1900-06-29'),
 ('Neil Gaiman','Britânica','1960-11-10'),
 ('Larinha','Brasileira','1996-01-01'),
 ('J. K. Rowling','Britânica','1965-07-31')
 
 
 INSERT INTO livros (titulo,genero, isbn, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id) VALUES
('O Senhor dos Anéis: A Sociedade do Anel','Fantasia','978-00-0000-001-1',1954,3,3,3),
--('O Senhor dos Anéis: As Duas Torres','Fantasia','978-00-0000-002-2',1954,3,3,3),
--('O Senhor dos Anéis: O Retorno do Rei','Fantasia','978-00-0000-003-3',1955,3,3,3),
('1984','Ficção distópica','978-00-0000-004-4',1949,4,4,4),
('A Revolução dos Bichos','Sátira política','978-00-0000-005-5',1945,4,4,4),
('O Pequeno Príncipe','Fábula','978-00-0000-006-6',1943,3,3,5),
('Coraline','Fantasia sombria','978-00-0000-007-7',2002,3,3,6),
('Eu quero a árvore que existe','Ensaios','9786555649413',2024,2,2,9),
('Harry Potter e a Pedra Filosofal','Fantasia','978-00-0000-010-0',1997,4,4,10),
('Livro do Desassossego','Prosa poética','978-00-0000-010-7',1982,2,2,1),
('Mensagem','Poesia','978-00-0000-010-8',1934,2,2,1),
('It: A Coisa','Terror','978-00-0000-011-0',1986,2,2,2),
('O Hobbit','Fantasia','978-00-0000-011-2',1937,2,2,3),
('Deuses Americanos','Fantasia','978-00-0000-011-3',2001,2,2,8)

insert into clientes (nome, email, telefone, data_cadastro) values 
('Sorin Jr','sorin.jr@example.com','(51) 99123-4567','2026-01-10'),
('João Nescau','joao.nescau@example.com','(51) 99234-5678','2026-01-15'),
('José Biguinin','jose.biguinin@example.com','(51) 99345-6789','2026-02-02'),
('Howard Wolowitz','howard.wolowitz@example.com','(61) 99901-2345','2026-05-03'),
('Stormtropper','stormtropper@example.com','(21) 99678-9012','2026-03-18')

insert into emprestimos( cliente_id, livro_id, data_emprestimo, data_prevista_devolucao, data_devolucao) values
(1, 4, '2026-11-06', '2026-11-20', NULL),
(2, 7, '2026-11-02', '2026-11-16', NULL),
(3, 10, '2026-10-15', '2026-10-29', '2026-10-27'),
(4, 13, '2026-11-01', '2026-11-15', NULL),
(5, 1, '2026-10-25', '2026-11-08', '2026-11-07'),
(1, 5, '2026-10-10', '2026-10-24', '2026-10-23'),
(2, 8, '2026-10-12', '2026-10-26', '2026-10-25'),
(3, 11, '2026-11-05', '2026-11-19', NULL),
(4, 14, '2026-10-28', '2026-11-11', NULL),
(5, 2, '2026-11-03', '2026-11-17', NULL)       

-- Livros com nome do autor, ano publicação
select l.titulo, a.nome as autores, l.genero, l.ano_publicacao 
from livros l
inner join autores a
	on a.id=l.autor_id
order by l.genero asc

-- Empréstimos ativos: cliente, livro e prazo
--Ativo = ainda não devolvido(data_devolucao vazia)
select c.nome as cliente, l.titulo as livro, e.data_emprestimo, e.data_prevista_devolucao
from emprestimos e
inner join clientes c
	on c.id = e.cliente_id
inner join livros l
	on l.id = e.livro_id
	where e.data_devolucao is null
order by c.nome asc


-- Quantidade de livros por autor (LEFT JOIN + GROUP BY)
-- LEFT JOIN: Um autor sem livros aparece com total de 0, em vez de sumir da lista
select a.nome as autore, count(l.id) as total_livros
from autores a
left join livros l
	on l.autor_id = a.id
group by a.id, a.nome
order by total_livros desc, a.nome
	
--Emprestimos atrasados: ativos com a data precista já vencida
--current date - data = quantidade de dias atraso
select c.nome as cliente, l.titulo as livro, e.data_prevista_devolucao,
current_date - e.data_prevista_devolucao as dias_atraso
from emprestimos e
inner join clientes c
	on c.id = e.cliente_id
inner join livros l
	on l.id = e.livro_id
where e.data_devolucao is null and e.data_prevista_devolucao < current_date
order by dias_atraso desc


-- Clientes que nunca fizeram emprestimo
-- left join + is null: quem não tem correspondencia fica com e.id vazio
select c.nome, c.email
from clientes c
left join emprestimos e
	on e.cliente_id = c.id
where e.id is null


-- Livros mais emprestados
select l.titulo, count(e.id) as total_emprestimos
from livros l
inner join emprestimos e
	on e.livro_id = l.id
group by l.id, l.titulo
order by total_emprestimos desc, l.titulo
limit 5

-- FILTER: conta só os emprestimos ativos e atrasados
select c.nome as cliente,
	count(e.id) as total_emprestimos,
	count(e.id) FILTER (where e.data_devolucao is null)as ativos
from clientes c
left join emprestimos e
	on e.cliente_id = c.id
GROUP BY c.id, c.nome
ORDER BY total_emprestimos DESC, c.nome

-- resumo do acervo numa linha só
-- COALESCE troca NULL por 0, caso a tabela esteja vazia.
SELECT 
	(SELECT COUNT(*) FROM autores ) AS autores,
	(SELECT COUNT(*) FROM livros) AS livros,
	(SELECT COALESCE (SUM(quantidade_total), 0) FROM livros) AS exemplares,
	(SELECT COALESCE(SUM(quantidade_disponivel), 0) FROM livros) AS exemplares_disponiveis,
	(SELECT COUNT(*) FROM clientes) AS clientes,
	(SELECT COUNT(*) FROM emprestimos WHERE data_devolucao IS NULL) as emprestimos_ativos,
	(SELECT COUNT(*) FROM emprestimos
		WHERE data_devolucao IS NULL AND data_prevista_devolucao < CURRENT_DATE) AS emprestimos_atrasados
