/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rorate
 * 5. Next / pev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active songs
 * 9. Scroll active song in to view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY= '12_PLAYER';

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");

const btnPlay = $(".btn-toggle-play");
const player = $(".player");

const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");
const btnRandom = $(".btn-random");
const btnRepeat = $(".btn-repeat");

const playList = $(".playlist");
const progress = $("#progress");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    
    songs: [
        {
            name: "Always Remember Us This Way",
            singer: "Lady Gaga",
            path: "./asset/music/alway.mp3",
            image: "./asset/img/always.jpg",
        },
        {
            name: "Ăn gì đây",
            singer: "MrT x Hoà Minzy",
            path: "./asset/music/angiday.mp3",
            image: "./asset/img/angiday.jpg",
        },
        {
            name: "Let her go",
            singer: "Passenger",
            path: "./asset/music/LetHerGo.mp3",
            image: "./asset/img/LetHerGo.jpg",
        },
        {
            name: "Lily .ft K391",
            singer: "Alan Walker",
            path: "./asset/music/Lily.mp3",
            image: "./asset/img/lily.webp",
        },
        {
            name: "Darkside",
            singer: "Alan Walker",
            path: "./asset/music/Darkside.mp3",
            image: "./asset/img/darkside.jpg",
        },
        {
            name: "The Drum",
            singer: "Alan Walker",
            path: "./asset/music/Drum.mp3",
            image: "./asset/img/drum.jpg",
        },
        {
            name: "Dream",
            singer: "Alan Walker",
            path: "./asset/music/Dreams.mp3",
            image: "./asset/img/dream.jpg",
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    // 1. Render songs
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        });
        playList.innerHTML = htmls.join("");
    },
    // getCurrent Song
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvent: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // 4. CD rorate
        const cdThumAnimate = cdThumb.animate(
            [
                {
                    transform: "rotate(360deg)",
                },
            ],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );

        cdThumAnimate.pause();
        // 2. Scroll top
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // 3. Play / pause / seek
        // PLAY
        btnPlay.onclick = function () {
            // Đang playing thì isPlaying = false
            if (_this.isPlaying) {
                audio.pause();
            } else {
                // Đang pause thì sẽ Playing
                audio.play();
            }
        };
        // Khi song playing
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumAnimate.play();
        };

        // Khi song pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumAnimate.pause();
        };

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };

        // Xử lý khi tua bài hat
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        // NEXT bài hát
        btnNext.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
                // audio.play();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Prev bài hát
        btnPrev.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            // _this.scrollToActiveSong();
        };

        // Random bài hát
        btnRandom.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', !_this.isRandom);
            btnRandom.classList.toggle("active", _this.isRandom);
        };

        // Next xong khi hết bài hát
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                btnNext.click();
            }
        };

        // Repeat bai hat
        btnRepeat.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', !_this.isRepeat);

            btnRepeat.classList.toggle("active", _this.isRepeat);
        };

        //Lắng nghe event click vào playList
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (
                songNode ||
                e.target.closest(".option")
            ) {
                // Xu li khi click vao bai hat
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xu li khi click vao Song option
                if (e.target.closest(".option")) {
                }
            }
        };
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 300);
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;

    },
    // 5. Next song
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    // Prev song
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    // RANDOM song
    randomSong: function () {
        let newIndex = this.currentIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex == this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // this.loadConfig();
        
        // ĐỊNH NGHĨA CÁC THUỘC TÍNH CHO OBJECT
        this.defineProperties();

        // LẮNG NGHE / XỬ LÝ CÁC SỰ KIỆN (DOM EVENTS)
        this.handleEvent();

        // Load thong tin bai hat dau tien vao UI khi chay app
        this.loadCurrentSong();

        // RENDER PLAYLIST
        this.render();

        //hien thi trang thai ban dau cua button repeat va random
        // btnRepeat.classList.toggle("active", this.isRepeat);
        // btnRandom.classList.toggle("active", this.isRandom);

    },
};
app.start();
