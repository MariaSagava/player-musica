module.exports = class Album {
    constructor(titulo, capa, genero) {
      this.id = 0;
      this.titulo = titulo;      
      this.genero = genero;
      this.capa = capa;      
      this.artista = null;
      this.listaMusicas = [];
    }
}