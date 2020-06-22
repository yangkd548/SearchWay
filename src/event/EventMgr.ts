module Dylan {
    class EventObj {
        public caller: any;
        public listener: Function;

        constructor(caller: any, listener: Function) {
            this.caller = caller;
            this.listener = listener;
        }
    }

    export class EventMgr {
        private _listeners: object;

        constructor() { }

        /**
         * Add an event listener
         * @method addEventListener
         * @param  {String} type
         * @param  {Function} listener
         * @return {EventTarget} The self object, for chainability.
         */
        public On(type: string, caller: any, listener: Function) {
            if (this._listeners === undefined) { this._listeners = {}; }
            let listeners = this._listeners;
            if (listeners[type] === undefined) {
                listeners[type] = [];
            }
            let listenerArray = listeners[type];
            for (var i = 0, l = listenerArray.length; i < l; i++) {
                let eventObj = listenerArray[i];
                if (eventObj.caller == caller && eventObj.listener == listener) {
                    return this;
                }
            }
            listenerArray.push(new EventObj(caller, listener));
            return this;
        }

        /**
         * Check if an event listener is added
         * @method hasEventListener
         * @param  {String} type
         * @param  {Function} listener
         * @return {Boolean}
         */
        public Has(type: string, caller: any, listener: Function) {
            if (this._listeners === undefined) { return false; }
            let listenerArray = this._listeners[type];
            if (listenerArray === undefined) { return false; }
            for (var i = 0, l = listenerArray.length; i < l; i++) {
                let eventObj = listenerArray[i];
                if (eventObj.caller == caller && eventObj.listener == listener) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Check if any event listener of the given type is added
         * @method hasAnyEventListener
         * @param  {String} type
         * @return {Boolean}
         */
        public HasAny(type: string, caller: any) {
            if (this._listeners === undefined) { return false; }
            let listenerArray = this._listeners[type];
            if (listenerArray === undefined) { return false; }
            for (var i = 0, l = listenerArray.length; i < l; i++) {
                let eventObj = listenerArray[i];
                if (eventObj.caller == caller) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Remove an event listener
         * @method removeEventListener
         * @param  {String} type
         * @param  {Function} listener
         * @return {EventTarget} The self object, for chainability.
         */
        public Off(type: string, caller: any, listener: Function) {
            if (this._listeners === undefined) { return this; }
            let listenerArray = this._listeners[type];
            if (listenerArray === undefined) { return this; }
            for (var i = listenerArray.length - 1, l = listenerArray.length; i >= 0; i--) {
                let eventObj = listenerArray[i];
                if (eventObj.caller == caller && eventObj.listener == listener) {
                    return listenerArray.splice(i, 1);
                }
            }
            return this;
        }

        /**
         * Emit an event.
         * @method dispatchEvent
         */
        public Emit(type: string, data: any = null) {
            if (this._listeners === undefined) { return this; }
            let listenerArray = this._listeners[type];
            if (listenerArray === undefined) { return this; }
            for (var i = 0, l = listenerArray.length; i < l; i++) {
                let eventObj = listenerArray[i];
                eventObj.listener.call(eventObj.caller, data);
            }
            return this;
        }
    }
}