// set to window, so it can survive hmr if we add it
const transmitterGlobalName = 'WEB_IFC_TRANSMITTER'
if (!(globalThis as any)[transmitterGlobalName]) {
    (globalThis as any)[transmitterGlobalName] = {};
}

function transmitter() {
    return (globalThis as any)[transmitterGlobalName];
}

// microtask
export function publish(channel: string, ...args: any[]): void {
    // todo: use queueMicrotask instead? https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/queueMicrotask
    // what do I gain by using it?
    Promise.resolve().then(() => {
        if (Array.isArray(transmitter()[channel])) {
            for (let i = 0, len = transmitter()[channel].length; i < len; i++) {
                if (transmitter()[channel][i]) {
                    const ctx = transmitter()[channel][i].ctx;
                    transmitter()[channel][i].func.apply(ctx, args);
                }
            }
        }
    });
}

// sync
export function publishSync(channel: string, ...args: any[]): void {
    if (Array.isArray(transmitter()[channel])) {
        for (let i = 0, len = transmitter()[channel].length; i < len; i++) {
            if (transmitter()[channel][i]) {
                const ctx = transmitter()[channel][i].ctx;
                transmitter()[channel][i].func.apply(ctx, args);
            }
        }
    }
}

// next task, do I also want a middle ground? requestAnimation frame?
export function publishNext(channel: string, ...args: any[]): void {
    setTimeout(() => {
        if (Array.isArray(transmitter()[channel])) {
            for (let i = 0, len = transmitter()[channel].length; i < len; i++) {
                if (transmitter()[channel][i]) {
                    const ctx = transmitter()[channel][i].ctx;
                    transmitter()[channel][i].func.apply(ctx, args);
                }
            }
        }
    }, 0);
}

// sync
export function unSubscribe(channel: string, ctx: any): void {
    if (Array.isArray(transmitter()[channel])) {
        const events = transmitter()[channel].filter((event: any) => {
            if (event.ctx !== ctx) {
                return true;
            } else {
                return false;
            }
        });
        transmitter()[channel] = events;
    }
}

// sync
export function subscribe(channel: string, ctx: any, func: (...args: any[]) => void): void {
    if (!Array.isArray(transmitter()[channel])) {
        transmitter()[channel] = [];
    }
    transmitter()[channel].push({ ctx: ctx, func: func });
}