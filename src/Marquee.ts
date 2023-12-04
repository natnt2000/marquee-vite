customElements.define(
  "x-marquee",
  class extends HTMLElement {
    #shadowRoot;
    constructor() {
      super();
      let style = this.getAttribute("style") || "";
      let pauseOnHover = this.getAttribute("pauseOnHover") || false;
      let pauseOnClick = this.getAttribute("pauseOnClick") || false;
      let direction = this.getAttribute("direction") || "left";
      let speed = this.getAttribute("speed") ? Number(this.getAttribute("speed")) : 100;
      let play = this.getAttribute("play") || "true";
      let gap = this.getAttribute("gap") || "50px";
      let className = this.getAttribute('class') || '';
      let gradient = this.getAttribute('gradient') || false;

      this.#shadowRoot = this.attachShadow({ mode: "open" });

      this.#shadowRoot.innerHTML = `
      <style>
        .marquee-container {
          display: flex;
          width: 100%;
          overflow-x: hidden;
          flex-direction: row;
          position: relative;
        }
      
        .marquee-container:hover .marquee {
          animation-play-state: var(--pause-on-hover);
        }
      
        .marquee-container:active .marquee {
          animation-play-state: var(--pause-on-click);
        }
      
        .marquee {
          flex: 0 0 auto;
          min-width: 100%;
          z-index: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          animation: scroll var(--duration) linear infinite;
          animation-play-state: var(--play);
          animation-direction: var(--direction);
          gap: var(--gap, 0);
          margin-right: var(--gap, 0);
        }
      
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      
        .initial-child-container {
          flex: 0 0 auto;
          display: flex;
          min-width: auto;
          flex-direction: row;
        }
      
        .gradient::after,
        .gradient::before {
          background: linear-gradient(
            to right,
            var(--gradientColor, white),
            transparent
          );
          content: "";
          height: 100%;
          position: absolute;
          width: var(--gradientWidth, 10%);
          z-index: 2;
        }
      
        .gradient::before {
          left: 0;
          top: 0;
        }
      
        .gradient::after {
          right: 0;
          top: 0;
          transform: rotateZ(180deg);
        }
      </style>

      <div
        style="${style}
        --gap: ${gap}; 
        --play: ${play === 'true' ? "running": "paused"}; 
        --direction: ${ direction === "left" ? "normal" : "reverse"}; 
        --pause-on-hover: ${pauseOnHover ? "paused" : "running"}; 
        --pause-on-click: ${pauseOnClick ? 'paused' : 'running'}"
        class="marquee-container ${className}"
      >
        ${gradient ? `<div class="gradient" data-testid="marquee-gradient" />`: ``}
        <div class="marquee">
          <slot></slot>
        </div>
        <div class="marquee">
          <slot></slot>
        </div>
      </div>
      `;
      const marqueeContainer = this.#shadowRoot.querySelector(
        ".marquee-container"
      ) as Element;
      const marquee = this.#shadowRoot.querySelector(
        ".marquee"
      ) as Element;
      const resizeObserver = new ResizeObserver(() => {
        const duration =
        marquee.clientWidth < marqueeContainer.clientWidth
        ? marqueeContainer.clientWidth / speed
        : marquee.clientWidth / speed
        this.#shadowRoot.querySelector<HTMLElement>('.marquee-container')?.style.setProperty('--duration', `${duration}s`)
      });

      resizeObserver.observe(marqueeContainer);
      resizeObserver.observe(marquee);
    }

    connectedCallback() {
      let slots = this.#shadowRoot.querySelectorAll('slot');

      slots[0].addEventListener('slotchange', function(_) {
          let nodes = slots[0].assignedNodes();
          nodes.forEach(node => {
            slots[1].appendChild(node.cloneNode(true))
          })
      });
  }
  }
);
