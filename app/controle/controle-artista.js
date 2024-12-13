const Artista = require("../modelo/artista");
const database = require("../database");

class ControleArtista {
    async insertArtista(artista) {
        try {
            const sql = "INSERT INTO artista (nome, pais, data_nasc, foto) VALUES (?, ?, ?, ?)";
            const result = await database.query(sql, [
                artista.nome,
                artista.pais,
                artista.data_nasc,
                artista.foto
            ]);
            return result.insertId;
        } catch (error) {
            console.error("Erro ao inserir artista:", error);
            return -1;
        }
    }

    async selectAllArtistas() {
        try {
            const sql = "SELECT * FROM artista ORDER BY nome";
            const results = await database.query(sql);
            return results.map(row => {
                const artista = new Artista(row.nome, row.pais, row.data_nasc, row.foto);
                artista.id = row.id;
                return artista;
            });
        } catch (error) {
            console.error("Erro ao buscar artistas:", error);
            return [];
        }
    }
}

module.exports = new ControleArtista();