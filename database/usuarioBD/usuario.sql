DROP TABLE IF EXISTS usuario cascade;
DROP TABLE IF EXISTS recuperar_senhas cascade;


CREATE TABLE usuario (
    id INTEGER primary key,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    CHECK (cpf ~ '^[0-9]{11}$'),
    nome_completo VARCHAR(80) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(244) NOT NULL);

INSERT INTO usuario (id, cpf, nome_completo, email, senha)
VALUES
(1, '48511397809', 'vitor souza leal','vitorleal202@gmail.com', 'vitorgalo13'),
(2, '04851137809', 'vitor souza leal','vitorleal202@gmail.com', 'vitorgalo13');

/*
-- parte 2 / recuperar senha

create table recuperar_senhas(
id_recuperacao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
id_usuario integer not null,
codigo_hash varchar(244) not null,
data_criacao timestamp not null default current_timestamp,
data_expiracao timestamp not null,
utilizado boolean not null default false,
foreign key (id_usuario)
references usuario(id)
on delete cascade,
check (data_expiracao > data_criacao));

-- parte 3 / selecionar CPF
select id,nome_completo,email
from usuario
where CPF = '48511397809';

insert into recuperar_senha(
id_usuario,
codigo_hash,
data_expiracao
)

select 
id,
	'<hash do codigo>'
	CURRENT_TIMESTAMP + INTERVAL '10 minutes'
from usuariO
where cpf = '<CPF_informado>';


*/