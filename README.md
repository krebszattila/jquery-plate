# jquery-plate #

An easy to use jQuery plugin for adding nice 3D hover effect on any element.

Check out the [examples](https://krebszattila.github.io/jquery-plate/)!

## Setup ##

Simply include jquery.plate.js after jQuery.

```html
<script src="jquery.js"></script>
<script src="jquery.plate.js"></script>
```

## API ##

### Initialize ###

Initialize the plate effect by calling `.plate()` on the selected element(s).

You can customize the effect by passing an [options](#options) object as an argument.

```javascript
$('.plate').plate();     // default options

$('.plate').plate({      // custom options
    inverse: false,
    perspective: 500,
    maxRotation: 10,
    animationDuration: 200
});
```

### Reconfigure ###

Call `.plate(options)` again on an element to modify the settings.

```javascript
$('.plate').plate({      // initialize
    inverse: false,
    animationDuration: 50
});

$('.plate').plate({      // reconfigure
    inverse: true
});
```

### Remove ###

To remove the effect from an element simply call `remove`.

```javascript
$('.plate').plate('remove');
```

## Options ##

* `inverse`: By default the element rotates away from the mouse pointer. Set this option to `true`, if you want to rotate the element towards the mouse pointer. Default value is `false`.
* `perspective`: The transformation [perspective](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/perspective) in pixels. Default is `500`.
* `maxRotation`: The maximum rotation in degrees. Default is `10`.
* `animationDuration`: The animation duration in milliseconds used on mouse enter and mouse leave. Default is `200`.
* `element`: The element which the effect applies to. See details [below](#remote-effect). Default is `undefined`.

### Remote effect ###

If you provide an `element` setting, the plate effect will be applied to that element rather than the selected element. (The mouse event listeners will still be attached to the selected element.)

Provide a selector string to find an element inside the selected element:

```html
<div class="listener">
    <div class="plate"></div>
</div>
```

```javascript
$('.listener').plate({
    element: '.plate'
});
```

Or provide a jQuery element to use any element in the document:

```html
<div class="listener"></div>
<div class="plate"></div>
```

```javascript
$('.listener').plate({
    element: $('.plate')
});
```
