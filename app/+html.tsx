import type { PropsWithChildren } from "react";

/**
 * app/+html.tsx  — Expo Router v6 HTML shell (web only).
 * Renders the app inside a photorealistic iPhone 17 Pro frame.
 * The native app is NOT modified — this file only affects the web build.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Coterie</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <div className="scene">
          <div className="phone-outer">

            {/* ── Left side: Action button, Vol+, Vol– ── */}
            <div className="btn left action-btn" />
            <div className="btn left vol-up" />
            <div className="btn left vol-down" />

            {/* ── Right side: Power, Camera Control ── */}
            <div className="btn right power-btn" />
            <div className="btn right cam-ctrl" />

            {/* ── Titanium frame ── */}
            <div className="frame">

              {/* top edge catch-light */}
              <div className="frame-top-light" />

              {/* ── Black glass face ── */}
              <div className="glass">

                {/* Screen glare overlay */}
                <div className="glare" />

                {/* Dynamic Island */}
                <div className="dynamic-island">
                  <div className="di-camera" />
                </div>

                {/* ── App renders here at 390×844 ── */}
                <div className="screen">
                  {children}
                </div>

                {/* Home indicator */}
                <div className="home-bar" />

              </div>{/* /glass */}
            </div>{/* /frame */}

          </div>{/* /phone-outer */}
        </div>{/* /scene */}
      </body>
    </html>
  );
}

const css = `
/* ── Reset ──────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  overflow: hidden;          /* no page scroll — phone is fixed in viewport */
}

/* ── Scene: full viewport, dark bg, centres the phone ───── */
.scene {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at 50% 40%, #1e1e20 0%, #0a0a0b 65%);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Outer wrapper: scaled to fit screen ─────────────────
   The frame + screen are at 1:1 size (390×844 screen).
   transform:scale shrinks the visuals while React Native
   still reports 390×844 as window dimensions internally. */
.phone-outer {
  position: relative;
  /* Frame total: 418 wide × 872 tall (screen + 11×2 bezel + 3×2 frame ring) */
  /* Add side padding for button protrusion */
  padding: 0 16px;

  transform: scale(0.86);
  transform-origin: center center;

  /* Negative margin compensates layout space that transform doesn't reclaim */
  margin-top:  -62px;
  margin-bottom: -62px;
}

/* ── Side buttons ─────────────────────────────────────── */
.btn {
  position: absolute;
  width: 4px;
  z-index: 10;
}

/* Black Titanium button — gradient makes them look 3-D */
.btn.left {
  left: 0;
  background: linear-gradient(
    90deg,
    #1a1816 0%,
    #4e4c48 30%,
    #383633 60%,
    #1a1816 100%
  );
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12),
              inset 0 -1px 0 rgba(0,0,0,0.8);
  border-radius: 0 3px 3px 0;
}
.btn.right {
  right: 0;
  background: linear-gradient(
    270deg,
    #1a1816 0%,
    #4e4c48 30%,
    #383633 60%,
    #1a1816 100%
  );
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12),
              inset 0 -1px 0 rgba(0,0,0,0.8);
  border-radius: 3px 0 0 3px;
}

/* Action button (small oval, iPhone 17 Pro left-side) */
.action-btn  { top: 122px; height: 28px; border-radius: 4px; }
/* Volume +/– */
.vol-up      { top: 172px; height: 66px; border-radius: 2px; }
.vol-down    { top: 254px; height: 66px; border-radius: 2px; }
/* Power */
.power-btn   { top: 185px; height: 88px; border-radius: 2px; }
/* Camera Control (iPhone 16/17 Pro right-side) */
.cam-ctrl    { top: 508px; height: 36px; border-radius: 4px; }

/* ── Titanium frame ring ──────────────────────────────── */
.frame {
  position: relative;
  width:  418px;
  height: 872px;
  border-radius: 56px;
  padding: 3px;

  /* Black Titanium gradient — directional brushed-metal look */
  background:
    repeating-linear-gradient(
      108deg,
      transparent           0px,
      transparent           1.8px,
      rgba(255,255,255,0.014) 1.8px,
      rgba(255,255,255,0.014) 2.4px
    ),
    linear-gradient(
      158deg,
      #525049  0%,
      #2c2a27 10%,
      #464440 20%,
      #1e1c1a 32%,
      #3e3c38 44%,
      #262421 56%,
      #403e3b 68%,
      #302e2b 80%,
      #504e4a 90%,
      #3a3835 100%
    );

  box-shadow:
    /* Outer edge hairline highlight */
    0 0 0 0.6px rgba(255,255,255,0.10),
    /* Top specular catch-light */
    inset 0  2px 0 rgba(255,255,255,0.22),
    /* Bottom shadow edge */
    inset 0 -2px 0 rgba(0,0,0,0.95),
    /* Side depth */
    inset  2.5px 0 5px rgba(255,255,255,0.05),
    inset -2.5px 0 5px rgba(0,0,0,0.55),
    /* Main drop shadow — heavy, photorealistic */
    0  50px 120px rgba(0,0,0,0.98),
    0  18px  45px rgba(0,0,0,0.80),
    0   6px  16px rgba(0,0,0,0.65);
}

/* Top-edge catch-light bar (flat titanium catches overhead light) */
.frame-top-light {
  position: absolute;
  top: 2px;
  left: 18%;
  right: 18%;
  height: 1px;
  border-radius: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.55) 40%,
    rgba(255,255,255,0.55) 60%,
    transparent
  );
  pointer-events: none;
  z-index: 5;
}

/* ── Black glass face ─────────────────────────────────── */
.glass {
  position: relative;
  width:  100%;
  height: 100%;
  border-radius: 53px;
  overflow: hidden;

  /* Very slightly lighter than pure black — real glass isn't #000 */
  background: #090909;

  box-shadow:
    inset 0 0 40px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.04);
}

/* Diagonal glass sheen (catch-light reflection on front glass) */
.glare {
  position: absolute;
  inset: 0;
  border-radius: 53px;
  background: linear-gradient(
    128deg,
    rgba(255,255,255,0.055)  0%,
    rgba(255,255,255,0.018) 25%,
    transparent              45%,
    transparent              70%,
    rgba(255,255,255,0.010) 100%
  );
  pointer-events: none;
  z-index: 300;
}

/* ── Screen ───────────────────────────────────────────── */
.screen {
  position: absolute;
  top:  11px;
  left: 11px;
  width:  390px;
  height: 844px;
  border-radius: 46px;
  overflow: hidden;
  background: #000;

  /* Faint screen-edge glow — lit display look */
  box-shadow:
    0 0 0 0.5px rgba(255,255,255,0.04),
    0 0 30px rgba(180,160,255,0.03);
}

/* Make whatever Expo mounts fill the screen div */
.screen > * {
  width:  100% !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}

/* ── Dynamic Island ───────────────────────────────────── */
.dynamic-island {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width:  126px;
  height:  37px;
  border-radius: 50px;
  background: #000;
  z-index: 200;

  box-shadow:
    0 0 0 0.8px rgba(255,255,255,0.07),
    inset 0 -1px 3px rgba(0,0,0,0.9),
    inset 0  1px 1px rgba(255,255,255,0.03);

  /* Flexbox to position the front camera dot */
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 18px;
}

/* Front camera lens within Dynamic Island */
.di-camera {
  width:  12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 35%,
    #1a2535 0%,
    #090e18 60%,
    #000    100%
  );
  box-shadow:
    0 0 0 1.5px rgba(255,255,255,0.06),
    inset 0 0 4px rgba(100,140,255,0.15);
}

/* ── Home indicator ───────────────────────────────────── */
.home-bar {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width:  131px;
  height:   5px;
  border-radius: 3px;
  background: rgba(255,255,255,0.30);
  z-index: 200;
}
`;
