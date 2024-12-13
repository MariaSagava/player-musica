window.addEventListener("load", ()=> {
    adicionarFiltro("busca-artista", "artista");
    adicionarFiltro("busca-album", "album");
    // var select = document.querySelector("#artista");

    // select.addEventListener("change", (evt) => {
    //     var foto = document.querySelector(`option[value="${select.value}"]`).getAttribute("foto");
    //     document.querySelector("#foto-artista").src = "/fotos/" + foto;
    // });

    document.querySelector("#arquivo").addEventListener("change", (evento) => {
        document.querySelector("#musica-preview").src = URL.createObjectURL(evento.target.files[0]);
    });
});