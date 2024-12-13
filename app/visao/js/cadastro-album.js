window.addEventListener("load", () => {
    document.querySelector("#arquivo").addEventListener("change", (evento) => {
        document.querySelector("#foto-preview").src = URL.createObjectURL(evento.target.files[0]);
    });
});