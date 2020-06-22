var Dylan;
(function (Dylan) {
    var EventObj = /** @class */ (function () {
        function EventObj(caller, listener) {
            this.caller = caller;
            this.listener = listener;
        }
        return EventObj;
    }());
    var EventMgr = /** @class */ (function () {
        function EventMgr() {
        }
        /**
         * Add an event listener
         * @method addEventListener
         * @param  {String} type
         * @param  {Function} listener
         * @return {EventTarget} The self object, for chainability.
         */
        EventMgr.prototype.On = function (type, caller, listener) {
            if (this._listeners === undefined) {
                this._listeners = {};
            }
            var listeners = this._listeners;
            if (listeners[type] === undefined) {
                listeners[type] = [];
            }
            var listenerArray = listeners[type];
            for (var i = 0, l = listenerArray.length; i < l; i++) {
                var eventObj = listenerArray[i];
                if (eventObj.caller == caller && eventObj.listener == listener) {
                    return this;
                }
            }
            listenerArray.push(new EventObj(caller, listener));
            return this;
        };
        /**
         * Check if an event listener is added
         * @method hasEventListener
         * @param  {String} type
         * @param  {Function} listener
         * @return {Boolean}
         */
        EventMgr.prototype.Has = function (type, caller, listener) {
            if (this._listeners === undefined) {
                return false;
            }
            var listenerArray = this._listeners[type];
            if (listenerArray === undefined) {
                return false;
            }
            for (var i = 0, l = listenerArray.length; i < l; i++) {
                var eventObj = listenerArray[i];
                if (eventObj.caller == caller && eventObj.listener == listener) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Check if any event listener of the given type is added
         * @method hasAnyEventListener
         * @param  {String} type
         * @return {Boolean}
         */
        EventMgr.prototype.HasAny = function (type, caller) {
            if (this._listeners === undefined) {
                return false;
            }
            var listenerArray = this._listeners[type];
            if (listenerArray === undefined) {
                return false;
            }
            for (var i = 0, l = listenerArray.length; i < l; i++) {
                var eventObj = listenerArray[i];
                if (eventObj.caller == caller) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Remove an event listener
         * @method removeEventListener
         * @param  {String} type
         * @param  {Function} listener
         * @return {EventTarget} The self object, for chainability.
         */
        EventMgr.prototype.Off = function (type, caller, listener) {
            if (this._listeners === undefined) {
                return this;
            }
            var listenerArray = this._listeners[type];
            if (listenerArray === undefined) {
                return this;
            }
            for (var i = listenerArray.length - 1, l = listenerArray.length; i >= 0; i--) {
                var eventObj = listenerArray[i];
                if (eventObj.caller == caller && eventObj.listener == listener) {
                    return listenerArray.splice(i, 1);
                }
            }
            return this;
        };
        /**
         * Emit an event.
         * @method dispatchEvent
         */
        EventMgr.prototype.Emit = function (type, data) {
            if (data === void 0) { data = null; }
            if (this._listeners === undefined) {
                return this;
            }
            var listenerArray = this._listeners[type];
            if (listenerArray === undefined) {
                return this;
            }
            for (var i = 0, l = listenerArray.length; i < l; i++) {
                var eventObj = listenerArray[i];
                eventObj.listener.call(eventObj.caller, data);
            }
            return this;
        };
        return EventMgr;
    }());
    Dylan.EventMgr = EventMgr;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=EventMgr.js.map