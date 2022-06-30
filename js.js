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

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');

const btnPlay = $('.btn-toggle-play');
const player = $('.player');

const btnNext = $('.btn-next');
const btnPrev = $(".btn-prev");
const btnRandom = $(".btn-random");

const progress = $('#progress');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    songs: [{
            name: 'Lily .ft K391',
            singer: 'Alan Walker',
            path: './asset/music/Lily.mp3',
            image: './asset/img/lily.webp'
        },
        {
            name: 'Darkside',
            singer: 'Alan Walker',
            path: './asset/music/Darkside.mp3',
            image: './asset/img/darkside.jpg'
        },
        {
            name: 'The Drum',
            singer: 'Alan Walker',
            path: './asset/music/Drum.mp3',
            image: './asset/img/drum.jpg'
        },
        {
            name: 'Dream',
            singer: 'Alan Walker',
            path: './asset/music/Dreams.mp3',
            image: './asset/img/dream.jpg'
        },
    ],

    // 1. Render songs
    render: function () {
        const htmls = this.songs.map(song => {
            return `
            <div class="song">
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
            `
        })
        $('.playlist').innerHTML = htmls.join('');
    },
    // getCurrent Song
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvent: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // 4. CD rorate
        const cdThumAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000,
            iterations: Infinity
        })

        cdThumAnimate.pause()
        // 2. Scroll top 
        document.onscroll = function () {
            // console.log(window.scrollY);
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // 3. Play / pause / seek
        // PLAY
        btnPlay.onclick = function () {
            // Đang playing thì isPlaying = false
            if (_this.isPlaying) {
                audio.pause();
            } else { // Đang pause thì sẽ Playing 
                audio.play();
            }

        }
        // Khi song playing 
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumAnimate.play()

        }

        // Khi song pause 
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumAnimate.pause()

        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xử lý khi tua bài hat
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;

        }

        // NEXT bài hát
        btnNext.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
                audio.play();
            } else {
                _this.nextSong();
                audio.play();
            }

        }

        // Prev bài hát
        btnPrev.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
                audio.play();


            } else {
                _this.prevSong();
                audio.play();
            }
           
        }

        // Random bài hát
        btnRandom.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            btnRandom.classList.toggle('active', _this.isRandom);
        }

        // Next xong khi hết bài hát
        audio.onended = function() {
            
        }
    },
    loadCurrentSong: function () {

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

    },
    // 5. Next song
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    // Prev song
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    // RANDOM song
    randomSong: function () {
        let newIndex = this.currentIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex == this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong()
    },
    start: function () {
        // ĐỊNH NGHĨA CÁC THUỘC TÍNH CHO OBJECT
        this.defineProperties();

        // LẮNG NGHE / XỬ LÝ CÁC SỰ KIỆN (DOM EVENTS)
        this.handleEvent();

        // Load thong tin bai hat dau tien vao UI khi chay app
        this.loadCurrentSong();

        // RENDER PLAYLIST
        this.render();
    }
}
app.start()
