const Musica = require("../modelo/musica");
const database = require("../database");

class ControleMusica {
    async insertMusica(musica, idAlbum) {
        try {
            const sql = `
                INSERT INTO musica (titulo, arquivo, duracao, genero, id_album) 
                VALUES (?, ?, ?, ?, ?)
            `;
            const result = await database.query(sql, [
                musica.titulo,
                musica.arquivo,
                musica.duracao,
                musica.genero,
                idAlbum
            ]);
            return result.insertId;
        } catch (error) {
            console.error("Erro ao inserir música:", error);
            return -1;
        }
    }

    async insertMusicaArtista(idMusica, idArtista) {
        try {
            const sql = "INSERT INTO musica_artista (id_musica, id_artista) VALUES (?, ?)";
            await database.query(sql, [idMusica, idArtista]);
            return true;
        } catch (error) {
            console.error("Erro ao vincular música ao artista:", error);
            return false;
        }
    }

    async selectMusicasDoAlbum(idAlbum) {
        try {
            const sql = `
                SELECT m.*, GROUP_CONCAT(a.nome) as artistas
                FROM musica m
                LEFT JOIN musica_artista ma ON m.id = ma.id_musica
                LEFT JOIN artista a ON ma.id_artista = a.id
                WHERE m.id_album = ?
                GROUP BY m.id
                ORDER BY m.id
            `;
            const results = await database.query(sql, [idAlbum]);
            return results.map(row => {
                const musica = new Musica(row.titulo, row.arquivo, row.duracao, row.genero);
                musica.id = row.id;
                musica.artistas = row.artistas ? row.artistas.split(',') : [];
                return musica;
            });
        } catch (error) {
            console.error("Erro ao buscar músicas do álbum:", error);
            return [];
        }
    }
}

module.exports = new ControleMusica();