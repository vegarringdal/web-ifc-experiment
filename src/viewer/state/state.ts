import { publish, subscribe, unSubscribe } from './transmitter';

const stateGlobalName = 'WEB_IFC_STATE'
const state = (globalThis as any)[stateGlobalName] || {};
const keys = new Set();

export const GLOBAL_STATE_EVENT = 'GLOBAL_STATE_EVENT';

// helper if we want to save state
if (!(window as any)[stateGlobalName]) {
    (globalThis as any)[stateGlobalName] = {};
    window.addEventListener('SIMPLE_HTML_SAVE_STATE', () => {
        // here we could have set it to local store/file
        (globalThis as any)[stateGlobalName] = state;
        console.log(stateGlobalName, (globalThis as any)[stateGlobalName]);
    });
}

/**
 * Types only
 */
type valueSetter<T> = (value: T) => void;
type stateResult<T> = [T, valueSetter<T>];
type stateResultObj<T> = [T, <K extends keyof T>(part: Pick<T, K>) => void];

/**
 * simple warning if you reuse a key by accident
 * @param key
 */
export function validateKey(key: string) {
    if (keys.has(key)) {
        throw new Error(`state key used allready, use another name`);
    } else {
        keys.add(key);
        return key;
    }
}

// internal object
const State = class <T> {
    mainStateKey: string;
    isObject: boolean;
    internalStateKey: string;
    defaultValue: T;

    /**
     * Simple global state container
     * @param STATE_KEY
     * @param defaultValue
     * @param isObject
     * @param internalStateKey if you use internal store then it wont be verified if you override old keys
     */
    constructor(
        STATE_KEY: string,
        defaultValue: T = null,
        isObject: boolean,
        internalStateKey: string | null
    ) {
        this.mainStateKey = STATE_KEY;
        this.defaultValue = defaultValue;
        if (internalStateKey) {
            // set main state
            if (!this.getStateContainer().hasOwnProperty(this.mainStateKey)) {
                this.getStateContainer()[this.mainStateKey] = {};
            }

            // set internal state
            this.internalStateKey = internalStateKey;
            if (!this.getStateContainer().hasOwnProperty(this.internalStateKey)) {
                if (typeof defaultValue === 'object' && defaultValue !== null) {
                    this.getStateContainer()[this.internalStateKey] = defaultValue;
                } else {
                    this.getStateContainer()[this.internalStateKey] = {};
                }
            }
        } else {
            if (!this.getStateContainer().hasOwnProperty(this.mainStateKey)) {
                this.getStateContainer()[this.mainStateKey] = defaultValue;
            }

            this.isObject = isObject;
            if (!this.getStateContainer()[this.mainStateKey] && this.isObject) {
                this.getStateContainer()[this.mainStateKey] = {};
            }

            validateKey(this.mainStateKey);
        }
    }

    protected getStateContainer() {
        if (this.internalStateKey) {
            return state[this.mainStateKey];
        }
        return state;
    }

    /**
     * Return key of this state
     * If it have a internal key then its a internal state
     */
    protected getStateKey() {
        return this.internalStateKey || this.mainStateKey;
    }

    protected resetSimpleState(val: any = this.defaultValue) {
        if (this.isObject) {
            throw 'this is object only state, use resetObj';
        }
        this.getStateContainer()[this.getStateKey()] = val;
    }

    protected resetObjectState(val = this.defaultValue) {
        this.getStateContainer()[this.getStateKey()] = val;
    }

    /**
     * return state [value, setter]
     */
    protected getSimpleState(): stateResult<T> {
        if (this.isObject) {
            throw 'this is object only state, use getObjectValue';
        }

        const STATE_KEY = this.getStateKey();
        const STATE = this.getStateContainer();
        const MAIN_KEY = this.mainStateKey;
        const INTERNAL_KEY = this.internalStateKey;

        const setAndPublish = function (value: any) {
            STATE[STATE_KEY] = value;
            publish(GLOBAL_STATE_EVENT, state, MAIN_KEY, INTERNAL_KEY);
            publish(STATE_KEY, value);
        };

        return [STATE[STATE_KEY], setAndPublish];
    }

    /**
     * just return simple value
     */
    protected getSimpleValue(): T {
        if (this.isObject) {
            throw 'this is object only state, use getObject';
        }

        return this.getStateContainer()[this.getStateKey()];
    }

    /**
     * return state [value, setter]
     * this uses built in object.assign in setter
     */
    protected getObjectState(): stateResultObj<T> {
        const STATE_KEY = this.getStateKey();
        const STATE = this.getStateContainer();
        const MAIN_KEY = this.mainStateKey;
        const INTERNAL_KEY = this.internalStateKey;

        function assignState<T, K extends keyof T>(obj: T, part: Pick<T, K>) {
            return Object.assign(obj, part);
        }

        function assignAndPublish<K extends keyof T>(part: Pick<T, K>): void {
            STATE[STATE_KEY] = assignState(STATE[STATE_KEY] as T, part);
            publish(GLOBAL_STATE_EVENT, state, MAIN_KEY, INTERNAL_KEY);
            publish(STATE_KEY, STATE[STATE_KEY]);
        }

        return [STATE[STATE_KEY], assignAndPublish];
    }

    /**
     * just return simple value, of object type
     */
    protected getObjectValue(): T {
        return this.getStateContainer()[this.getStateKey()];
    }

    public getValue() {
        if (this.isObject) {
            return this.getObjectValue();
        } else {
            return this.getSimpleValue();
        }
    }

    public reset(x: any) {
        if (this.isObject) {
            return this.resetObjectState(x);
        } else {
            return this.resetSimpleState(x);
        }
    }

    /**
     * connect to state in elements connectedcallback, will automatically disconnect if dicconnectedcallback is called
     * @param context must be object
     * @param callback
     */
    public subscribe(context: {}, callback: () => void): void {

        // for following the event we just use the internal event handler
        subscribe(this.getStateKey(), context, callback);
    }

    public unsubscribe(context: {}) {
        unSubscribe(this.getStateKey(), context)
    }
};

export class ObjectState<T> extends State<T> {
    constructor(STATE_KEY: string, defaultValue: T = {} as T) {
        super(STATE_KEY, defaultValue, true, null);
    }

    public getState(): stateResultObj<T> {
        return this.getObjectState();
    }

    public getSetter() {
        const [, setter] = this.getObjectState();
        return setter;
    }
    public setValue<K extends keyof T>(part: Pick<T, K>): void {
        const [, setter] = this.getObjectState();
        setter(part);
    }
}

export class SimpleState<T> extends State<T> {
    constructor(STATE_KEY: string, defaultValue: T = null) {
        super(STATE_KEY, defaultValue, false, null);
    }
    public getState(): stateResult<T> {
        return this.getSimpleState();
    }

    public getSetter() {
        const [, setter] = this.getSimpleState();
        return setter;
    }
    public setValue(value: any): void {
        const [, setter] = this.getSimpleState();
        setter(value);
    }
}

export class ObjectStateInternal<T> extends State<T> {
    constructor(STATE_KEY: string, defaultValue: T = {} as T, internalProp: string) {
        super(STATE_KEY, defaultValue, true, internalProp);
    }
    public getState(): stateResultObj<T> {
        return this.getObjectState();
    }

    public getSetter() {
        const [, setter] = this.getObjectState();
        return setter;
    }
    public setValue<K extends keyof T>(part: Pick<T, K>): void {
        const [, setter] = this.getObjectState();
        setter(part);
    }
}

export class SimpleStateInternal<T> extends State<T> {
    constructor(STATE_KEY: string, defaultValue: T = null, internalProp: string) {
        super(STATE_KEY, defaultValue, false, internalProp);
    }
    public getState(): stateResult<T> {
        return this.getSimpleState();
    }
    public getSetter() {
        const [, setter] = this.getSimpleState();
        return setter;
    }
    public setValue(value: any): void {
        const [, setter] = this.getSimpleState();
        setter(value);
    }
}
