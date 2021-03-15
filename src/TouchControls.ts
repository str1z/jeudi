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
  background: "rgba(50,50,50,0.5)",
};

const allKeyDicts = Object.keys(keyToKeyCodes).map((key) => ({ key, keyCode: keyToKeyCodes[key] }));

export default class TouchControls {
  joystickOrigin: HTMLElement;
  joystick: HTMLElement;
  size: number;
  originSize: number;

  isJoystickActive: boolean;
  didJoystickMove: boolean;
  isSecondButtonActive: boolean;

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

    function preventGesture(e: Event) {
      e.preventDefault();
      document.body.style.zoom = "0.999";
    }

    window.addEventListener("gesturestart", preventGesture);
    window.addEventListener("gesturechange", preventGesture);
    window.addEventListener("gestureend", preventGesture);

    window.setInterval(this.tick, 200);
  }

  tick = () => {
    if (!this.isJoystickActive) return;

    const th = this.size;
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
    // dont move the joystick if it is already active
    if (this.isJoystickActive) {
      this.isSecondButtonActive = true;
      this.dispatchKeyDown(" ");
    } else {
      // you are now using the joystick
      this.isJoystickActive = true;
      this.didJoystickMove = false;
      this.joystickOrigin.style.display = "block";
      const { clientX, clientY } = e.touches[e.touches.length - 1];
      this.joystickOrigin.style.left = clientX - this.size + "px";
      this.joystickOrigin.style.top = clientY - this.size + "px";
      this.originPosition = new Phaser.Math.Vector2(clientX, clientY);
      this.position = new Phaser.Math.Vector2(clientX, clientY);
    }
  };

  onTouchMove = (e: TouchEvent) => {
    // move the joystick
    this.didJoystickMove = true;
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

  onTouchEnd = () => {
    if (this.isSecondButtonActive) {
      this.isSecondButtonActive = false;
      this.dispatchKeyUp(" ");
    } else {
      if (!this.didJoystickMove) {
        this.dispatchKeyDown(" ");
      }
      this.joystickOrigin.style.display = "none";
      this.joystick.style.display = "none";
      for (const dict of allKeyDicts) this.dispatchKeyEvent("keyup", dict);
      this.isJoystickActive = false;
    }
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
}
