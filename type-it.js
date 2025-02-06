/**
 * @file type-it.js
 * @version 2.1.0
 * @author Chayson Media Group (https://chayson.com/)
 * @license MIT
 */
class TypeIt {
  constructor(element) {
    this.element = element;
    this.cursor = null;
    const delim = element.dataset.delim || ',';
    const words = element.dataset.words || 'override these,sample typing';
    this.words = words.split(delim).filter((v) => v);
    this.delayVariance = parseInt(element.dataset.delayVariance) || 0;
    this.delay = parseInt(element.dataset.delay) || 200;
    this.loop = element.dataset.loop !== 'false';
    this.deleteDelay = parseInt(element.dataset.deletedelay || element.dataset.deleteDelay) || 800;

    this.progress = { word: 0, char: 0, building: true, looped: 0 };
    this.typing = true;

    const colors = element.dataset.colors || 'black';
    this.colors = colors.split(',');
    this.element.style.color = this.colors[0];
    this.colorIndex = 0;

    this.doTyping();
  }

  start() {
    if (!this.typing) {
      this.typing = true;
      this.doTyping();
    }
  }

  stop() {
    this.typing = false;
  }

  doTyping() {
    const { element, progress, words } = this;
    const { word, char, building } = progress;
    const currentDisplay = [...words[word]].slice(0, char).join('');
    const atWordEnd = char === words[word].length;
    const timeoutDelay = ((2 * Math.random() - 1) * this.delayVariance) + this.delay;

    if (this.cursor && this.cursor.element && this.cursor.interval) {
      this.cursor.element.style.opacity = '1';
      this.cursor.on = true;
      clearInterval(this.cursor.interval);
      this.cursor.interval = setInterval(() => this.cursor.updateBlinkState(), 400);
    }

    element.innerHTML = currentDisplay;

    if (building) {
      if (atWordEnd) {
        progress.building = false;
      } else {
        progress.char += 1;
      }
    } else {
      if (char === 0) {
        progress.building = true;
        progress.word = (word + 1) % words.length;
        this.colorIndex = (this.colorIndex + 1) % this.colors.length;
        element.style.color = this.colors[this.colorIndex];
      } else {
        progress.char -= 1;
      }
    }

    if (!building && !this.loop && progress.word === words.length - 1 && char === 0) {
      this.typing = false;
    } else {
      setTimeout(() => {
        if (this.typing) {
          this.doTyping();
        }
      }, atWordEnd ? this.deleteDelay : timeoutDelay);
    }
  }
}

class Cursor {
  constructor(element) {
    this.element = element;
    this.cursorDisplay = element.dataset.cursordisplay || element.dataset.cursorDisplay || '_';
    element.innerHTML = this.cursorDisplay;
    this.on = true;
    element.style.transition = 'all 100ms';
    this.interval = setInterval(() => this.updateBlinkState(), 400);
  }

  updateBlinkState() {
    this.element.style.opacity = this.on ? '0' : '1';
    this.on = !this.on;
  }
}

function TypeSetup() {
  const typers = {};
  for (const e of document.getElementsByClassName('typeit')) {
    typers[e.id] = new TypeIt(e);
  }
  for (const e of document.getElementsByClassName('typeit-stop')) {
    const owner = typers[e.dataset.owner];
    e.onclick = () => owner.stop();
  }
  for (const e of document.getElementsByClassName('typeit-start')) {
    const owner = typers[e.dataset.owner];
    e.onclick = () => owner.start();
  }
  for (const e of document.getElementsByClassName('cursor')) {
    const t = new Cursor(e);
    t.owner = typers[e.dataset.owner];
    t.owner.cursor = t;
  }
}

// Attach classes and setup function to the global window object.
window.Typeit = TypeIt;
window.Cursor = Cursor;
window.TypeSetup = TypeSetup;
