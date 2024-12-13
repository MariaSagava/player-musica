CREATE DATABASE IF NOT EXISTS musicas_db;
USE musicas_db;

CREATE TABLE IF NOT EXISTS artista (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    pais VARCHAR(50),
    data_nasc DATE,
    foto VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS album (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    capa VARCHAR(255),
    genero VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS musica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    arquivo VARCHAR(255),
    duracao TIME,
    genero VARCHAR(50),
    id_album INT,
    FOREIGN KEY (id_album) REFERENCES album(id)
);

CREATE TABLE IF NOT EXISTS musica_artista (
    id_musica INT,
    id_artista INT,
    FOREIGN KEY (id_musica) REFERENCES musica(id),
    FOREIGN KEY (id_artista) REFERENCES artista(id),
    PRIMARY KEY (id_musica, id_artista)
);