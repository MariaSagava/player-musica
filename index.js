// Importar dependências necessárias
const express = require("express");
const bodyParser = require('body-parser');
const multer = require("multer");
const fs = require('fs-extra');
const path = require('path');
const database = require('./app/database');

//----- configurar servidor -----//
const app = express();
const port = 3000;

app.use(express.static(__dirname + '/app/visao'));
app.use(express.static(__dirname + '/files'));

const jsonParser = bodyParser.json();
const urlParser = bodyParser.urlencoded({ extended: false });

//----- configurar pacote para salvar arquivos -----//
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

function moverArquivo(tipo, arquivo) {
    return new Promise((resolve, reject) => {
        fs.move('files/' + arquivo, 'files/' + tipo + '/' + arquivo, { overwrite: true })
            .then(() => resolve())
            .catch(err => {
                console.error('Erro ao mover arquivo:', err);
                reject(err);
            });
    });
}

//----- importar classes -----//
const Musica = require("./app/modelo/musica");
const Album = require("./app/modelo/album");
const Artista = require("./app/modelo/artista");

const controleArtista = require("./app/controle/controle-artista");
const controleMusica = require("./app/controle/controle-musica");
const controleAlbum = require("./app/controle/controle-album");

app.set('view engine', 'ejs');
app.set('views', './app/visao');

// Adicione no início do arquivo, após os requires


// Criar pastas necessárias se não existirem
const directories = ['files', 'files/capas', 'files/fotos', 'files/musicas'];
directories.forEach(dir => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Diretório criado: ${dir}`);
    }
});

// Criar imagem padrão para álbuns se não existir
const defaultAlbumPath = 'files/capas/default-album.jpg';
if (!fs.existsSync(defaultAlbumPath)) {
    // Copiar de uma URL ou criar uma imagem básica
    const defaultImageContent = Buffer.from(
        'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        'base64'
    );
    fs.writeFileSync(defaultAlbumPath, defaultImageContent);
    console.log('Imagem padrão para álbuns criada');
}

//----- <----- Rotas -----> -----//
app.get("/", (req, res) => {
    async function abrirIndex() {
        var lista_albums = await controleAlbum.selectAllAlbums();
        res.render("index", { musicas: [], albums: lista_albums });
    }
    abrirIndex();
});

app.post("/", urlParser, (req, res) => {
    async function abrirIndex() {
        var lista_albums = await controleAlbum.selectAllAlbums();
        var lista_musicas = await controleMusica.selectMusicasDoAlbum(req.body.id_album);
        res.render("index", { musicas: lista_musicas, albums: lista_albums });
    }
    abrirIndex();
});

//----- Cadastro artista -----//
app.get("/cadastro-artista", (req, res) => {
    res.render("cadastro-artista", { error: null });
});

app.post("/confirmar-cadastro-artista", upload.single("foto"), (req, res) => {
    console.log("Body recebido:", req.body);
    console.log("Arquivo recebido:", req.file);
    async function cadastrar_artista() {
        try {
            if (!req.file) {
                return res.render("confirmar-cadastro-artista", { 
                    success: false, 
                    error: "Nenhuma foto foi enviada" 
                });
            }

            console.log("Dados recebidos:", {
                nome: req.body.nome,
                pais: req.body.pais,
                data_nasc: req.body.data_nasc,
                foto: req.file.filename
            });

            const artista = new Artista(
                req.body.nome,
                req.body.pais,
                req.body.data_nasc,
                req.file.filename
            );

            const resultado = await controleArtista.insertArtista(artista);
            console.log("Resultado da inserção:", resultado);

            if (resultado !== -1) {
                await moverArquivo("fotos", req.file.filename);
                res.render("confirmar-cadastro-artista", { 
                    success: true, 
                    artista: artista 
                });
            } else {
                res.render("confirmar-cadastro-artista", { 
                    success: false, 
                    error: "Erro ao cadastrar artista no banco de dados" 
                });
            }
        } catch (erro) {
            console.error("Erro no cadastro de artista:", erro);
            res.render("confirmar-cadastro-artista", { 
                success: false, 
                error: erro.message 
            });
        }
    }

    cadastrar_artista();
});

//----- Cadastro álbum -----//
app.get("/cadastro-album", (req, res) => {
    async function abrirCadastroAlbum() {
        try {
            const artistas = await controleArtista.selectAllArtistas();
            res.render("cadastro-album", { artistas: artistas });
        } catch (error) {
            console.error("Erro ao carregar artistas:", error);
            res.render("cadastro-album", { artistas: [] });
        }
    }
    abrirCadastroAlbum();
});

app.post("/confirmar-cadastro-album", upload.single("arquivo"), (req, res) => {
    async function cadastrar_album() {
        try {
            if (!req.file) {
                return res.render("confirmar-cadastro-album", { 
                    success: false, 
                    error: "Nenhum arquivo foi enviado" 
                });
            }

            const album = new Album(req.body.titulo, req.file.filename, req.body.genero);
            const resultado = await controleAlbum.insertAlbum(album);
            
            if (resultado !== -1) {
                await moverArquivo("capas", req.file.filename);
                res.render("confirmar-cadastro-album", { success: true, album: album });
            } else {
                res.render("confirmar-cadastro-album", { 
                    success: false, 
                    error: "Erro ao cadastrar álbum" 
                });
            }
        } catch (erro) {
            console.error("Erro no cadastro de álbum:", erro);
            res.render("confirmar-cadastro-album", { 
                success: false, 
                error: erro.message 
            });
        }
    }
    cadastrar_album();
});

//----- Cadastro música -----//
app.get("/cadastro-musica", (req, res) => {
    async function abrirCadastroMusica() {
        try {
            const lista_artistas = await controleArtista.selectAllArtistas();
            const lista_albums = await controleAlbum.selectAllAlbums();
            res.render("cadastro-musica", { 
                artistas: lista_artistas, 
                albums: lista_albums,
                error: null 
            });
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            res.render("cadastro-musica", { 
                artistas: [], 
                albums: [],
                error: "Erro ao carregar dados" 
            });
        }
    }
    abrirCadastroMusica();
});

app.post("/confirmar-cadastro-musica", upload.single("arquivo"), (req, res) => {
    async function cadastrar_musica() {
        try {
            if (!req.file) {
                return res.render("confirmar-cadastro-musica", { 
                    success: false, 
                    error: "Nenhum arquivo foi enviado" 
                });
            }

            const musica = new Musica(
                req.body.titulo, 
                req.file.filename, 
                req.body.duracao, 
                req.body.genero
            );

            const resultado = await controleMusica.insertMusica(musica, req.body.album);
            
            if (resultado !== -1) {
                const resultado2 = await controleMusica.insertMusicaArtista(resultado, req.body.artista);
                await moverArquivo("musicas", req.file.filename);
                
                res.render("confirmar-cadastro-musica", { 
                    success: true, 
                    musica: musica 
                });
            } else {
                res.render("confirmar-cadastro-musica", { 
                    success: false, 
                    error: "Erro ao cadastrar música" 
                });
            }
        } catch (erro) {
            console.error("Erro no cadastro de música:", erro);
            res.render("confirmar-cadastro-musica", { 
                success: false, 
                error: erro.message 
            });
        }
    }
    cadastrar_musica();
});

// Adicione esta nova rota após as rotas existentes
app.get("/albuns", (req, res) => {
    async function exibirAlbuns() {
        try {
            console.log("Iniciando busca de álbuns...");
            const lista_albums = await controleAlbum.selectAllAlbums();
            console.log("Álbuns encontrados:", lista_albums);

            // Obtendo lista única de gêneros
            const generos = [...new Set(lista_albums.map(album => album.genero))];
            console.log("Gêneros disponíveis:", generos);

            if (!lista_albums || lista_albums.length === 0) {
                console.log("Nenhum álbum encontrado");
                return res.render("exibir-albuns", { 
                    albums: [],
                    genres: [],
                    message: "Nenhum álbum cadastrado ainda"
                });
            }

            res.render("exibir-albuns", { 
                albums: lista_albums,
                genres: generos
            });
        } catch (erro) {
            console.error("Erro ao exibir álbuns:", erro);
            res.status(500).render("error", { 
                message: "Erro ao carregar os álbuns",
                error: erro.toString()
            });
        }
    }
    exibirAlbuns();
});

//----- Inicia servidor -----//
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Algo deu errado!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});