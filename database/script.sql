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
 ('Clarice Lispector','Ucraniana-brasileira','1920-12-10'),
 ('Machado de Assis','Brasileira','1839-06-21'),
 ('Fernando Pessoa','Portuguesa','1888-06-13'),
 ('Stephen King','Estadunidense','1947-09-21'),
 ('J. R. R. Tolkien','Britânica','1892-01-03'),
 ('George Orwell','Britânica','1903-06-25'),
 ('Antoine de Saint-Exupéry','Francesa','1900-06-29'),
 ('Neil Gaiman','Britânica','1960-11-10'),
 ('Chuck Palahniuk','Estadunidense','1962-02-21'),
 ('Chris Kyle','Estadunidense','1974-04-08'),
 ('Larinha','Brasileira','1996-01-01'),
 ('J. K. Rowling','Britânica','1965-07-31'),
 ('Robert C. Martin','Estadunidense','1952-12-05')
 
 INSERT INTO livros (titulo,genero, isbn, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id) VALUES
('O Senhor dos Anéis: A Sociedade do Anel','Fantasia','978-00-0000-001-1',1954,3,3,5),
--('O Senhor dos Anéis: As Duas Torres','Fantasia','978-00-0000-002-2',1954,3,3,5),
--('O Senhor dos Anéis: O Retorno do Rei','Fantasia','978-00-0000-003-3',1955,3,3,5),
('1984','Ficção distópica','978-00-0000-004-4',1949,4,4,6),
('A Revolução dos Bichos','Sátira política','978-00-0000-005-5',1945,4,4,6),
('O Pequeno Príncipe','Fábula','978-00-0000-006-6',1943,3,3,7),
('Coraline','Fantasia sombria','978-00-0000-007-7',2002,3,3,8),
('Clube da Luta','Ficção contemporânea','978-00-0000-008-8',1996,3,3,9),
('Sniper Americano','Autobiografia','978-00-0000-009-9',2012,2,2,10),
('Eu quero a árvore que existe','Ensaios','9786555649413',2024,2,2,11),
('Harry Potter e a Pedra Filosofal','Fantasia','978-00-0000-010-0',1997,4,4,14),
('Código Limpo','Tecnologia','978-00-0000-010-1',2008,3,3,15),
('A Hora da Estrela','Romance','978-00-0000-010-2',1977,5,5,1),
--('Laços de Família','Contos','978-00-0000-010-3',1960,5,5,1),
('Dom Casmurro','Romance','978-00-0000-010-4',1899,3,3,2),
--('Memórias Póstumas de Brás Cubas','Romance','978-00-0000-010-5',1881,3,3,2),
--('O Alienista','Conto','978-00-0000-010-6',1882,2,2,2),
('Livro do Desassossego','Prosa poética','978-00-0000-010-7',1982,2,2,3),
('Mensagem','Poesia','978-00-0000-010-8',1934,2,2,3),
--('O Iluminado','Terror','978-00-0000-010-9',1977,2,2,4),
('It: A Coisa','Terror','978-00-0000-011-0',1986,2,2,4),
--('Carrie, a Estranha','Terror','978-00-0000-011-1',1974,2,2,4),
('O Hobbit','Fantasia','978-00-0000-011-2',1937,2,2,5),
('Deuses Americanos','Fantasia','978-00-0000-011-3',2001,2,2,8)
--('Sobrevivente','Ficção contemporânea','978-00-0000-011-4',1999,2,2,9);

insert into clientes (nome, email, telefone, data_cadastro) values 
('Sorin Jr','sorin.jr@example.com','(51) 99123-4567','2026-01-10'),
('João Nescau','joao.nescau@example.com','(51) 99234-5678','2026-01-15'),
('José Biguinin','jose.biguinin@example.com','(51) 99345-6789','2026-02-02'),
('Gohan Vs Cell','gohan.vscell@example.com','(11) 99567-8901','2026-03-05'),
('Stormtropper','stormtropper@example.com','(21) 99678-9012','2026-03-18')
--('Monkey D. Luffy','monkey.luffy@example.com','(31) 99789-0123','2026-04-01'),
--('Itachi Uchiha','itachi.uchiha@example.com','(41) 99890-1234','2026-04-14'),
--('Howard Wolowitz','howard.wolowitz@example.com','(61) 99901-2345','2026-05-03'),
--('Bátma Gordo','batma.gordo@example.com','(71) 99012-3456','2026-05-20'),
--('Coringa Joker','coringa.joker@example.com','(81) 99111-2233','2026-06-08');

insert into emprestimos( cliente_id, livro_id, data_emprestimo, data_prevista_devolucao, data_devolucao) values
(1, 1, '2026-10-01', '2026-10-15', '2026-10-14'),  
(2, 2, '2026-10-05', '2026-10-19', '2026-10-20'),  
(3, 17, '2026-10-10', '2026-11-24', NULL),         
(1, 4, '2026-10-28', '2026-11-11', NULL),          
(4, 16, '2026-11-01', '2026-11-15', NULL),   
(2, 1, '2026-11-02', '2026-11-16', NULL),          

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
limit 3