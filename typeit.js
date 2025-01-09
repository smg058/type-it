/**
 * @file typeit.js
 * @version 2.0.0
 * @author Chayson Media Group (https://chayson.com/)
 * @license MIT
 * @module TypeIt
 *
 * @description
 * Initializes dynamic typing effects with optional cursor animations for DOM elements.
 * This module is an updated and modular version inspired by:
 * - [Typer.js by straversi](https://github.com/straversi/Typer.js/)
 * - [typer.js by Steven](https://steven.codes/typerjs/)
 *
 * @features
 * - **Typing**: Character-by-character word typing with speed customization.
 * - **Deleting**: Backspacing effect to remove text before typing the next word.
 * - **Looping**: Continuous or single cycle display of words.
 * - **Color Change**: Adjust text color for each word.
 * - **Cursor Animation**: A blinking cursor effect synchronized with typing.
 * - **Control**: Supports stop/start functionality via associated buttons.
 *
 * @usage
 * - Add elements with the class `typeit` to customize typing effects:
 *  - Use `data-*` attributes for configuration.
 *   - `data-words`: list of words to type, e.g., `"Hello,World,TypeIt"`.
 *   - `data-colors`: List of colors for each word, e.g., `"red,blue,green"`.
 *   - `data-delay`: Typing delay per character in ms (default: 200).
 *   - `data-deleteDelay`: Delay before deleting text in ms (default: 800).
 *   - `data-loop`: Set to `"true"` for loop, `"false"` for one cycle (default: true).
 * - Optionally, add a blinking cursor with the `cursor` class:
 *  - Link to a `typeit` element with `data-owner`.
 *  - Customize cursor with `data-cursorDisplay1 (default: `_`).
 * - Add control buttons (`typeit-stop`, `typeit-start`) linked by `data-owner`.
 *
 * @exampleHtml
 * ```html
 * <span class="typeit" id="myTyper" data-words="Hellp,World,TypeIt" data-colors="red,blue,green" data-delay="150" data-deleteDelay="1000"></span>
 * <span class="cursor" data-owner="myTyper"></span>
 * <button class="typeit-stop" data-owner="myTyper">Stop</button> (optional)
 * <button class="typeit-start" data-owner="myTyper">Start</button> (optional)
 * ```
 *
 * @exampleCss
 * ```css
 * .cursor {
 *  font-weight: bold;
 *  color: inherit;
 * }
 * ```
 *
 * @howToCall
 * - Include this script as an ES module:
 * ```html
 * <script type="module" src="typeit.js"></script>
 * ```
 * - Call `TypeSetup` on DOM load:
 * ```javascript
 * import { TypeSetup } from './typeit.js';
 * document.addEventListener('DOMContentLoaded', TypeSetup);
 * ```
 *
 * @notes
 * - Unique IDs for `typeit` elements are essential.
 * - Customization via data attributes allows for script reuse without changes.
 * - Supports multiple `typeit` and `cursor` elements on a page.
 */
export class TypeIt {
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

export class Cursor {
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

export function TypeSetup() {
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
