(function(win, doc){
    'use strict';

    function DOM(elements){
        if(!(this instanceof DOM))
            return new DOM(elements);
        this.element = doc.querySelectorAll(elements);
    }
    DOM.prototype.on = function on(eventType, callback){
        Array.prototype.forEach.call(this.element, function(element){
            element.addEventListener(eventType, callback, false);
        });
    };
    DOM.prototype.off = function off(eventType, callback){
        Array.prototype.forEach.call(this.element, function(element){
            element.removeEventListener(eventType, callback, false);
        });
    };
    DOM.prototype.get = function get(){
        return this.element;
    };

    win.DOM = DOM;
})(window, document);