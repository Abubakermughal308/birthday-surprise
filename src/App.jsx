import { useEffect, useRef, useState } from "react";
import "./App.css";

const birthdayConfig = {
  name: "Azba(angry brid)",

  message: `Happy Birthday! 🎂✨

May your life always be filled with happiness,
success, beautiful memories and amazing moments.

Stay blessed, keep smiling,
and always be the wonderful person you are and You shouldn't angry on me ❤️`,

  finalMessage: "Happy Birthday Once Again! 🎉❤️",

  music: "/birthday.mp3",

  colors: {
    roseGold: "#d9a679",
    blush: "#f3c9d6",
    lavender: "#b79bea",
  },

  balloonCount: 10,
  flowerCount: 6,
  heartCount: 8,
  sparkleCount: 10,

  finaleBalloonCount: 8,
  finaleHeartCount: 10,
  confettiCount: 90,

  typewriterSpeedMs: 32,
};

const EMOJI = {
  balloon: ["🎈"],
  flower: ["🌸", "🌷"],
  heart: ["💖", "💗"],
  sparkle: ["✨", "🌟"],
};

function App() {
  const [opened, setOpened] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [finaleVisible, setFinaleVisible] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [floatingItems, setFloatingItems] = useState([]);

  const musicRef = useRef(null);
  const confettiCanvasRef = useRef(null);

  const reduceMotion = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // -----------------------------
  // Sparkle canvas
  // -----------------------------
  const leftSparkleRef = useRef(null);
  const rightSparkleRef = useRef(null);

  useEffect(() => {
    if (reduceMotion.current) return;

    const initSparkles = (canvas) => {
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      let animationId;

      const resize = () => {
        canvas.width = canvas.offsetWidth * devicePixelRatio;
        canvas.height = canvas.offsetHeight * devicePixelRatio;
      };

      resize();

      const particles = Array.from({ length: 28 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.25 + 0.05,
        drift: (Math.random() - 0.5) * 0.2,
        twinkle: Math.random() * Math.PI * 2,
      }));

      const handleResize = () => resize();

      window.addEventListener("resize", handleResize);

      const frame = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
          p.twinkle += 0.04;
          p.y -= p.speed;
          p.x += p.drift;

          if (p.y < -10) p.y = canvas.height + 10;

          const alpha =
            ((Math.sin(p.twinkle) + 1) / 2) * 0.6 + 0.2;

          ctx.beginPath();
          ctx.arc(
            p.x,
            p.y,
            p.r * devicePixelRatio,
            0,
            Math.PI * 2
          );

          ctx.fillStyle = `rgba(232, 201, 160, ${alpha})`;
          ctx.fill();
        });

        animationId = requestAnimationFrame(frame);
      };

      frame();

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", handleResize);
      };
    };

    const cleanupLeft = initSparkles(leftSparkleRef.current);
    const cleanupRight = initSparkles(rightSparkleRef.current);

    return () => {
      cleanupLeft?.();
      cleanupRight?.();
    };
  }, []);

  // -----------------------------
  // Typewriter
  // -----------------------------
  useEffect(() => {
    if (!opened) return;

    if (reduceMotion.current) {
      setTypedText(birthdayConfig.message);
      setTypingDone(true);
      return;
    }

    let index = 0;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        index++;

        setTypedText(
          birthdayConfig.message.slice(0, index)
        );

        if (index >= birthdayConfig.message.length) {
          clearInterval(interval);
          setTypingDone(true);
        }
      }, birthdayConfig.typewriterSpeedMs);

      return () => clearInterval(interval);
    }, 400);

    return () => clearTimeout(timer);
  }, [opened]);

  // -----------------------------
  // Rising items
  // -----------------------------
  const spawnRiseItem = (type) => {
    const pool = EMOJI[type];
    const glyph =
      pool[Math.floor(Math.random() * pool.length)];

    const id = `${type}-${Date.now()}-${Math.random()}`;

    const size =
      type === "balloon"
        ? 2 + Math.random() * 1.6
        : type === "flower"
        ? 1.2 + Math.random() * 0.9
        : 0.8 + Math.random() * 0.7;

    const duration =
      type === "balloon"
        ? 9 + Math.random() * 6
        : 7 + Math.random() * 5;

    const drift = (Math.random() - 0.5) * 160;
    const rotStart = (Math.random() - 0.5) * 20;
    const rotEnd =
      rotStart + (Math.random() - 0.5) * 60;

    const item = {
      id,
      glyph,
      left: Math.random() * 96,
      size,
      duration,
      delay: Math.random() * 1.5,
      drift,
      rotStart,
      rotEnd,
      opacity: 0.55 + Math.random() * 0.4,
    };

    setFloatingItems((prev) => [...prev, item]);

    setTimeout(() => {
      setFloatingItems((prev) =>
        prev.filter((x) => x.id !== id)
      );
    }, (duration + item.delay) * 1000 + 500);
  };

  const seedRisingLayer = () => {
    if (reduceMotion.current) return;

    for (
      let i = 0;
      i < birthdayConfig.balloonCount;
      i++
    ) {
      setTimeout(
        () => spawnRiseItem("balloon"),
        i * 350
      );
    }

    for (
      let i = 0;
      i < birthdayConfig.flowerCount;
      i++
    ) {
      setTimeout(
        () => spawnRiseItem("flower"),
        i * 500 + 200
      );
    }

    for (
      let i = 0;
      i < birthdayConfig.heartCount;
      i++
    ) {
      setTimeout(
        () => spawnRiseItem("heart"),
        i * 420 + 400
      );
    }

    for (
      let i = 0;
      i < birthdayConfig.sparkleCount;
      i++
    ) {
      setTimeout(
        () => spawnRiseItem("sparkle"),
        i * 300 + 100
      );
    }
  };

  useEffect(() => {
    if (!opened || reduceMotion.current) return;

    seedRisingLayer();

    const interval = setInterval(() => {
      const roll = Math.random();

      if (roll < 0.35) {
        spawnRiseItem("balloon");
      } else if (roll < 0.55) {
        spawnRiseItem("flower");
      } else if (roll < 0.8) {
        spawnRiseItem("heart");
      } else {
        spawnRiseItem("sparkle");
      }
    }, 900);

    return () => clearInterval(interval);
  }, [opened]);

  // -----------------------------
  // Open surprise
  // -----------------------------
  const openSurprise = () => {
    setOpened(true);
  };

  // -----------------------------
  // Confetti
  // -----------------------------
  const fireConfetti = () => {
    const canvas = confettiCanvasRef.current;

    if (!canvas || reduceMotion.current) return;

    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;

    const colors = [
      "#d9a679",
      "#f3c9d6",
      "#b79bea",
      "#faf3ea",
      "#e8c9a0",
    ];

    const pieces = Array.from(
      {
        length: birthdayConfig.confettiCount,
      },
      () => ({
        x: Math.random() * canvas.width,
        y: -20,
        w: (4 + Math.random() * 5) * devicePixelRatio,
        h: (8 + Math.random() * 6) * devicePixelRatio,
        color:
          colors[
            Math.floor(Math.random() * colors.length)
          ],
        vy:
          (2 + Math.random() * 2.5) *
          devicePixelRatio,
        vx:
          (Math.random() - 0.5) *
          2 *
          devicePixelRatio,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.2,
      })
    );

    let frame = 0;

    const draw = () => {
      frame++;

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        ctx.fillStyle = p.color;

        ctx.fillRect(
          -p.w / 2,
          -p.h / 2,
          p.w,
          p.h
        );

        ctx.restore();
      });

      if (frame < 220) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );
      }
    };

    draw();
  };

  // -----------------------------
  // Finale
  // -----------------------------
  const triggerFinale = () => {
    for (
      let i = 0;
      i < birthdayConfig.finaleBalloonCount;
      i++
    ) {
      setTimeout(
        () => spawnRiseItem("balloon"),
        i * 120
      );
    }

    for (
      let i = 0;
      i < birthdayConfig.finaleHeartCount;
      i++
    ) {
      setTimeout(
        () => spawnRiseItem("heart"),
        i * 90 + 100
      );
    }

    for (let i = 0; i < 14; i++) {
      setTimeout(
        () => spawnRiseItem("sparkle"),
        i * 80 + 50
      );
    }

    fireConfetti();

    setTimeout(() => {
      setFinaleVisible(true);
    }, reduceMotion.current ? 0 : 500);
  };

  // -----------------------------
  // Music
  // -----------------------------
  const toggleMusic = async () => {
    const audio = musicRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setMusicPlaying(true);
      } catch {
        console.log(
          "birthday.mp3 not found or could not play."
        );
      }
    } else {
      audio.pause();
      setMusicPlaying(false);
    }
  };

  return (
    <>
      <div className="ambient-glow" />

      {/* OPENING SCREEN */}
      {!opened && (
        <div
          className="opening-screen"
          id="openingScreen"
        >
          <div
            className="opening-half opening-half--left"
          >
            <div className="opening-inner">
              <canvas
                ref={leftSparkleRef}
                className="sparkle-canvas"
              />

              <p className="eyebrow-line">
                a little something for
              </p>

              <h1 className="opening-title">
                <span className="line">Happy</span>
                <span className="line line--accent">
                  Birthday
                </span>
              </h1>

              <div className="opening-glyphs">
                🎂 ✨
              </div>
            </div>
          </div>

          <div
            className="opening-half opening-half--right"
          >
            <div className="opening-inner">
              <canvas
                ref={rightSparkleRef}
                className="sparkle-canvas"
              />

              <button
                className="surprise-btn"
                type="button"
                onClick={openSurprise}
              >
                <span>Open Surprise</span>
                <span className="surprise-btn__heart">
                  💝
                </span>
              </button>

              <p className="tap-hint">
                tap to begin
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN SCENE */}
      {opened && (
        <main
          className="main-scene is-revealed"
          aria-hidden="false"
        >
          <div className="rising-layer">
            {floatingItems.map((item) => (
              <span
                key={item.id}
                className="rise-item"
                style={{
                  left: `${item.left}%`,
                  fontSize: `${item.size}rem`,
                  "--drift": `${item.drift}px`,
                  "--rot-start": `${item.rotStart}deg`,
                  "--rot-end": `${item.rotEnd}deg`,
                  "--peak-opacity": item.opacity,
                  animationDuration: `${item.duration}s`,
                  animationDelay: `${item.delay}s`,
                }}
              >
                {item.glyph}
              </span>
            ))}
          </div>

          <canvas
            ref={confettiCanvasRef}
            className="confetti-canvas"
          />

          <section className="card-stage">
            <div className="birthday-card is-floating">
              <div className="birthday-card__glow" />

              <p className="birthday-card__eyebrow">
                to my amazing friend
              </p>

              <h2 className="birthday-card__name">
                {birthdayConfig.name}
              </h2>

              <div className="birthday-card__divider" />

              <p className="birthday-card__message">
                {typedText}
                {!typingDone && (
                  <span className="type-cursor" />
                )}
              </p>

              <button
                className="more-btn"
                type="button"
                onClick={triggerFinale}
              >
                <span>One More Surprise</span>
                <span className="more-btn__heart">
                  💝
                </span>
              </button>
            </div>
          </section>

          {/* FINALE */}
          <section
            className={`finale-overlay ${
              finaleVisible ? "is-visible" : ""
            }`}
            aria-hidden={!finaleVisible}
          >
            <div className="finale-content">
              <h2 className="finale-message">
                {birthdayConfig.finalMessage}
              </h2>

              <button
                className="finale-close"
                type="button"
                onClick={() =>
                  setFinaleVisible(false)
                }
              >
                back to the card
              </button>
            </div>
          </section>
        </main>
      )}

      {/* MUSIC */}
      <button
        className={`music-toggle ${
          musicPlaying ? "is-playing" : ""
        }`}
        type="button"
        aria-pressed={musicPlaying}
        onClick={toggleMusic}
      >
        <span className="music-icon">🎵</span>
        <span className="music-label">
          {musicPlaying ? "Music On" : "Music"}
        </span>
      </button>

      <audio
        ref={musicRef}
        src={birthdayConfig.music}
        loop
        preload="none"
      />
    </>
  );
}

export default App;
