window.addEventListener("load", () => {
    document.querySelector("#foto").addEventListener("change", (evento) => {
        document.querySelector("#foto-preview").src = URL.createObjectURL(evento.target.files[0]);
    });
});