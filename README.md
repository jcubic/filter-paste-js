## jQuery plugin for intercepting paste text into iframe with design mode

this plugin allow you to filter text pasted into iframe (tested on latest
Firefox and Chrome and Interent 8) it will not work in Opera

## usage:

```javascript

$(function() {
	$('iframe').designMode(true).filterPaste(function(text) {
		return text.replace(/<\/?\w+[^>]*>/gi, "");
	});
});
```

this will strip all tags from pasting text (like when you copy from a web page)

## Aditional plugins

1. document
2. body
3. designMode
4. selection
5. range

## License

This is free software. You may distribute it under the terms of the

Poetic License. http://genaud.net/2005/10/poetic-license/

