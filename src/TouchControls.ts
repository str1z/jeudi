import "phaser";

function addStyles(e: HTMLElement, styles: { [key: string]: string }) {
  for (let type in styles) {
    e.style[type] = styles[type];
  }
}

const keyToKeyCodes = {
  " ": 32,
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
};

const baseStyles = {
  position: "fixed",
  display: "none",
  border: "1px solid #333",
  background: "rgba(50,50,50,0.2)",
};

const allKeyDicts = Object.keys(keyToKeyCodes).map((key) => ({ key, keyCode: keyToKeyCodes[key] }));

export default class TouchControls {
  joystickOrigin: HTMLElement;
  joystick: HTMLElement;
  size: number;
  originSize: number;
  didMove: boolean;
  isActive: boolean;

  originPosition: Phaser.Math.Vector2;
  position: Phaser.Math.Vector2;

  constructor(size: number = 50) {
    this.size = size;
    this.originSize = size * 2;
    this.createElements();
    this.addCallbacks();
  }

  createElements() {
    this.joystickOrigin = document.body.appendChild(document.createElement("div"));
    this.joystick = document.body.appendChild(document.createElement("div"));
    this.addStyles();
  }

  addStyles() {
    addStyles(this.joystickOrigin, {
      ...baseStyles,
      width: this.originSize + "px",
      height: this.originSize + "px",
    });
    addStyles(this.joystick, {
      ...baseStyles,
      width: this.size + "px",
      height: this.size + "px",
    });
  }

  addCallbacks() {
    window.addEventListener("touchstart", this.onTouchStart);
    window.addEventListener("touchend", this.onTouchEnd);
    window.addEventListener("touchmove", this.onTouchMove);
    window.setInterval(this.tick, 100);
  }

  changeColor(color: string) {
    this.joystickOrigin.style.borderColor = color;
  }

  tick = () => {
    if (!this.isActive) return;

    const distance = this.position.distance(this.originPosition);
    if (distance > this.originSize) {
      this.changeColor("lime");
      this.dispatchKeyDown(" ");
    } else {
      this.changeColor("#333");
      this.dispatchKeyUp(" ");
    }

    const th = this.size / 2;

    if (this.position.x - this.originPosition.x < -th) {
      this.dispatchKeyDown("ArrowLeft");
    } else {
      this.dispatchKeyUp("ArrowLeft");
    }

    if (this.position.x - this.originPosition.x > th) {
      this.dispatchKeyDown("ArrowRight");
    } else {
      this.dispatchKeyUp("ArrowRight");
    }

    if (this.position.y - this.originPosition.y < -th) {
      this.dispatchKeyDown("ArrowUp");
    } else {
      this.dispatchKeyUp("ArrowUp");
    }

    if (this.position.y - this.originPosition.y > th) {
      this.dispatchKeyDown("ArrowDown");
    } else {
      this.dispatchKeyUp("ArrowDown");
    }
  };

  onTouchStart = (e: TouchEvent) => {
    this.didMove = false;

    this.joystickOrigin.style.display = "block";
    const { clientX, clientY } = e.touches[0];

    this.joystickOrigin.style.left = clientX - this.size + "px";
    this.joystickOrigin.style.top = clientY - this.size + "px";

    this.originPosition = new Phaser.Math.Vector2(clientX, clientY);
    this.position = new Phaser.Math.Vector2(clientX, clientY);

    this.isActive = true;
  };

  onTouchMove = (e: TouchEvent) => {
    this.didMove = true;
    this.joystick.style.display = "block";

    const { clientX, clientY } = e.touches[0];

    const halfSize = this.size / 2;
    const x = Math.max(
      this.originPosition.x - this.size,
      Math.min(this.originPosition.x + this.size, clientX)
    );
    const y = Math.max(
      this.originPosition.y - this.size,
      Math.min(this.originPosition.y + this.size, clientY)
    );

    this.joystick.style.left = x - halfSize + "px";
    this.joystick.style.top = y - halfSize + "px";

    this.position = new Phaser.Math.Vector2(clientX, clientY);
  };

  dispatchKeyEvent(type: string, dict: { keyCode: number; key: string }) {
    window.dispatchEvent(new KeyboardEvent(type, dict));
  }

  dispatchKeyUp(key: string) {
    this.dispatchKeyEvent("keyup", { key, keyCode: keyToKeyCodes[key] });
  }

  dispatchKeyDown(key: string) {
    this.dispatchKeyEvent("keydown", { key, keyCode: keyToKeyCodes[key] });
  }

  onTouchEnd = (e: TouchEvent) => {
    this.joystickOrigin.style.display = "none";
    this.joystick.style.display = "none";
    if (!this.didMove) {
      this.dispatchKeyDown(" ");
    }
    this.joystickOrigin.style.borderColor = "white";

    for (const dict of allKeyDicts) this.dispatchKeyEvent("keyup", dict);
    this.isActive = false;
  };
}
