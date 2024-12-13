window.addEventListener("load", () => {
    adicionarFiltro("busca-album", "album");
    adicionarFiltro("busca-musica", "musica");

    var selectMusica = document.querySelector("#musica");

    var player = document.querySelector("#player-de-musica");
    var btnPlayPlause = document.querySelector("#play-pause");
    var btnNext = document.querySelector("#next");
    var btnPrevious = document.querySelector("#previous");
    var seekbar = document.querySelector("#seekbar");
    var volume = document.querySelector("#player-volume");

    var playIcon = "<i class='bx bx-play-circle'></i>";
    var pauseIcon = "<i class='bx bx-pause-circle'></i>";

    var playing = false;

    function play_pause() {
        if (playing) {
            playing = false;
            player.pause();
            btnPlayPlause.innerHTML = playIcon;
        } else {
            playing = true;
            player.play();
            btnPlayPlause.innerHTML = pauseIcon;
        }
    }

    function updateMusica() {
        var arquivoMusica = selectMusica.children[selectMusica.selectedIndex].getAttribute("musica");
        player.src = "/musicas/" + arquivoMusica;

        setTimeout(() => {
            playing = false;
            play_pause();
        }, 20);
    }

    document.querySelector("#album").addEventListener("change", function (evento) {
        if (this.selectedIndex >= 0) {
            console.log(this.value);
            document.querySelector("#id_album").value = this.value;
            document.querySelector("#album-form").submit();
        }
    });

    selectMusica.addEventListener("change", function() {
        updateMusica();
    });

    btnPlayPlause.addEventListener("click", function () {        
        play_pause();        
    });

    btnNext.addEventListener("click", function () {
        var currentIndex = selectMusica.selectedIndex;
        var nextOption = selectMusica.children[currentIndex + 1];
        if (nextOption) {
            selectMusica.value = nextOption.value;
            updateMusica();
        }
    });

    btnPrevious.addEventListener("click", function() {
        var currentIndex = selectMusica.selectedIndex;
        var nextOption = selectMusica.children[currentIndex - 1];
        if (nextOption) {
            selectMusica.value = nextOption.value;
            updateMusica();
        }
    });

    player.addEventListener("loadedmetadata", function(){        
        seekbar.max = Math.abs(this.duration);
        document.querySelector("#tempo-total").innerText = fancyTimeFormat(this.duration);
    });

    player.addEventListener("timeupdate", function(){        
        seekbar.value = this.currentTime;
        document.querySelector("#tempo-atual").innerText = fancyTimeFormat(this.currentTime);        
    });

    seekbar.addEventListener("change", function() {
        player.currentTime = this.value;
    });

    player.addEventListener("ended", function() {
        player.currentTime = 0;

        var currentIndex = selectMusica.selectedIndex;
        var nextOption = selectMusica.children[currentIndex + 1];
        if (nextOption) {
            selectMusica.value = nextOption.value;
            updateMusica();
        }

        play_pause();
    });

    var volumeNo = "<i class='bx bxs-volume-mute'></i>";
    var volumeFull = "<i class='bx bxs-volume-full'></i>";
    var volumeLow = "<i class='bx bxs-volume-low'></i>";
    var volumeLowest = "<i class='bx bxs-volume'></i>";
    var volumeIcon = document.querySelector("#volume-icon");

    volume.addEventListener("change", function() {
        player.volume = this.value;
        
        if (this.value > 0.7) {
            volumeIcon.innerHTML = volumeFull;
        } else if (this.value > 0.2) {
            volumeIcon.innerHTML = volumeLow;
        } else if (this.value > 0.01) {
            volumeIcon.innerHTML = volumeLowest;
        } else {            
            volumeIcon.innerHTML = volumeNo;
        }
    });

    const eventChange = new Event("change");

    volumeIcon.addEventListener("click", function() {
        if (volume.value > 0) {
            volume.value = 0;
        } else {
            volume.value = 1;
        }

        volume.dispatchEvent(eventChange);
    });

    // setInterval(() => {
    //     console.log('a ', player.currentTime);
    //     console.log('b ', player.duration);
    // }, 500);
});

function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;
  
    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";
  
    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
  
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
  
    return ret;
  }