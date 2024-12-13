const Album = require("../modelo/album");
const database = require("../database");

class ControleAlbum {
    async insertAlbum(album) {
        try {
            const sql = "INSERT INTO album (titulo, capa, genero) VALUES (?, ?, ?)";
            const result = await database.query(sql, [album.titulo, album.capa, album.genero]);
            return result.insertId;
        } catch (error) {
            console.error("Erro ao inserir álbum:", error);
            return -1;
        }
    }

    async selectAllAlbums() {
        try {
            const sql = `
                SELECT a.*, COUNT(m.id) as total_musicas 
                FROM album a 
                LEFT JOIN musica m ON a.id = m.id_album 
                GROUP BY a.id 
                ORDER BY a.id DESC
            `;
            const results = await database.query(sql);
            return results.map(row => {
                const album = new Album(row.titulo, row.capa, row.genero);
                album.id = row.id;
                album.totalMusicas = parseInt(row.total_musicas) || 0;
                return album;
            });
        } catch (error) {
            console.error("Erro ao buscar álbuns:", error);
            return [];
        }
    }
}

module.exports = new ControleAlbum();