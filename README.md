# Type-It

**Type-It** is a lightweight JavaScript library that allows you to create dynamic typing effects for your website. With a customizable typing and deleting animation, you can add interactive and engaging text effects with minimal setup.

## Features

- Type and delete text in a smooth animation.
- Supports multiple words with customizable delays.
- Color cycling support for text as it types.
- Option to loop the typing effect.
- Easily configurable via `data-*` attributes on HTML elements.

## Installation

You can install **Type-It** via npm:

```bash
npm install type-it
```
Alternatively, you can include it directly in your project using a `<script>` tag.

```html
<script src="path/to/typeit.js"></script>
```

## Usage

### 1. HTML Setup

To use ***TypeIt***, simply add the class `typeit` to the elements where you want the typing effect to appear. You can 
also customize the typing speed, colors, and delay using the `data-*` attributes.

Here's an example:

```html
<div id="type1" class="typeit"
    data-words="Hello world!,Welcome to Type-It,Enjoy typing effects"
    data-delay="150"
    data-loop="true"
    data-colors="red,blue,green">
</div>
```

### 2. Adding a Cursor

You can add a blinking cursor by including a `div` with the `cursor` class and associating it with the typing element using the `data-owner` attribute.

```html
<div id="cursor1" class="cursor" data-owner="type1"></div>
```

### 3. Start/Stop Typing Dynamically

You can control the typing effect using start and stop buttons. The buttons will interact with the typing effect using the `data-owner` 
attribute, referencing the element that owns the typing effect.

```html
<button class="typeit-start" data-owner="type1">Start Typing</button>
<button class="typeit-stop" data-owner="type1">Stop Typing</button>
```

### 4. Customizing the TypeIt Effect

You can customize the typing effect by using various `data-*` attributes on the HTML element:

- `data-words`: A comma-separated list of words to type.
- `data-delay`: Delay between typing characters (in milliseconds).
- `data-loop`: Set to `true` to make the typing loop.
- `data-colors`: Comma-separated list of colors to cycle through as typing occurs.
- `data-cursordisplay`: The cursor character (e.g., `_`, `|`, etc.).
- `data-deletedelay`: Delay before deleting the word.

Example:

```html
<div id="type1" class="typeit"
    data-words="Type It,JavaScript,Dynamic Effects"
    data-delay="150"
    data-loop="true"
    data-colors="red,blue,green"
    data-cursordisplay="_"
    data-deletedelay="800">
</div>
```

### 5. Initializing TypeIt

If you are using the npm package and importing the script into your JavaScript file, you can initialize **TypeIt** with the following:

```javascript
import { TypeSetup } from 'type-it'

document.addEventListener('DOMContentLoaded', () => {
  TypeSetup();
});
```
This ensures that the typing effects are initialized after the page content has loaded.

## Credits

This project was inspired by and based on the following resources:

- [Typer.js by straversi](https://github.com/straversi/Typer.js/)
- [Typer.js on Steven's blog](https://steven.codes/typerjs/)

Thank you to the creator(s) of these resources for providing the foundation for this project!

## Contributing

Feel free to submit issues and pull requests for improvements. Contributions are welcome!

## License

**TypeIt** is open source and available under the [MIT License](License).
