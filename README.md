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

## Aditional plugins

1. document
2. body
3. designMode
4. selection
5. range
