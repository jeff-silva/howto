class GameInput {
  constructor() {
    this.events = {};
    this.keys = {};

    document.addEventListener("keydown", (ev) => {
      this.eventsNames(ev).map((key) => {
        this.keys[key] = ev;
      });
    });

    document.addEventListener("keyup", (ev) => {
      this.eventsNames(ev).map((key) => {
        delete this.keys[key];
      });
    });

    const updateHandle = () => {
      for (let key in this.keys) {
        const call = this.events[key];
        if (!call) continue;
        call(this.keys[key]);
      }
      requestAnimationFrame(updateHandle);
    };

    updateHandle();
  }

  eventsNames(ev) {
    return [ev.key, ev.code, `${ev.key}.keydown`, `${ev.code}.keydown`];
  }

  on(evts = [], callback) {
    evts.map((evt) => {
      this.events[evt] = callback;
    });
  }
}
