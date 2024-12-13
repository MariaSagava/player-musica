module.exports = class Musica {
    constructor(titulo, arquivo, duracao, genero) {
      this.id = 0;
      this.titulo = titulo;      
      this.arquivo = arquivo;
      this.duracao = duracao;
      this.genero = genero;
      this.listaArtistas = [];
    }
}