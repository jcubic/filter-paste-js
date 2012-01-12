/*
 * jQuery plugin for intercepting paste text into iframe with design mode
 *
 * This is free software. You may distribute it under the terms of the
 * Poetic License. http://genaud.net/2005/10/poetic-license/
 *
 * (c) 2012 Jakub Jankiewicz
 */

(function($) {

    $.fn.document = function() {
        if (document.all) {
            return this[0].contentWindow.document;
        } else if (this[0].contentDocument) {
            return this[0].contentDocument;
        } else {
            return this[0].document;
        }
    };
    
    $.fn.body = function() {
        return $(this.document()).find('body');
    };
    
    $.fn.designMode = function(toogle) {
        var self = this;
        if (toogle === undefined) {
            return self.document().designMode.toLowerCase() == 'on';
        } else {
            if ($.browser.msie) {
                self.document().designMode = toogle ? 'On' : 'Off';
                return self;
            } else {
                self.load(function() {
                    self.document().designMode = toogle ? 'On' : 'Off';
                });
                return self;
            }
        }
    };

    $.fn.selection = function() {
        var window = this[0].contentWindow;
        var doc = this[0].contentWindow.document || this[0].contentDocument;
        return doc.selection || window.getSelection();
    };


    $.fn.range = function() {
        var selection = this.selection();
        if (selection.getRangeAt) {
            return selection.getRangeAt(0);
        } else if (selection.createRange) {
            return selection.createRange();
        } else {
            var range = this.document().createRange();
            range.setStart(selection.anchorNode, selection.anchorOffset);
            range.setEnd(selection.focusNode, selection.focusOffset);
            return range;
        }
    };

    $.fn.paste = function(text) {
        if (this[0].nodeName.toLowerCase() == 'iframe') {
            var range = this.range();
            var doc = this.document();
            if (range.pasteHTML) {
                if ($.browser.msie) {
                    doc.focus();
                }
                range.pasteHTML(text);
            } else {
                doc.execCommand("inserthtml", false, text);
            }
        } else {
            throw new Exception("Attempt to paste text into non iframe");
        }
        return this;
    };
    $.fn.filterPaste = function(fn) {
        return $.each(this, function() {
            if (this.nodeName.toLowerCase() == 'iframe') {
                var self = $(this);
                self.load(function() {
                  self.body().bind('paste', function(e) {
                    var doc = self.document();
                    if (e.originalEvent.clipboardData ||
                        self[0].contentWindow.clipboardData || doc.dataTransfer) {
                        var text = (e.originalEvent.clipboardData || 
                               self[0].contentWindow.clipboardData || 
                               window.dataTransfer).getData('Text');
                        self.paste(fn(text));
                        e.preventDefault();
                    } else {
                        var range = self.range();
                        var body = $(this);
                        var fake = $('<div>\uFEFF\uFEFF</div>').
                            addClass('__fpaste__').appendTo(body);
                        function block(e) {
                            e.preventDefault();
                        }
                        body.bind('mousedown keydown', block);
                        var selection = self.selection();
                        (function() {
                            var d = fake[0].firstChild;
                            var rng = self.document().createRange();
                            rng.setStart(d, 0);
                            rng.setEnd(d, 2);
                            selection.removeAllRanges();
                            selection.addRange(rng);
                        })();

                        setTimeout(function() {
                            var $paste = body.find('.__fpaste__');
                            selection.removeAllRanges();
                            selection.addRange(range);
                            self.paste(fn($paste.html()));
                            $paste.remove();
                        }, 0);
                    }
                  });
                });
            } else {
                throw new Exception("Attempt to filterPaste with non iframe");
            }
        });
    };

})(jQuery);
