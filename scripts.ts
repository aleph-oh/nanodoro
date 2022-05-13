const assert = (condition: boolean, msg?: string) => {
    if (!condition) {
        throw new Error(msg);
    }
}

/**
 * A self-adjusting timer.
 */
class Timer {
    interval: number;
    drift: number;

    expected?: number;
    timeout?: number;
    cb?: () => void;
    on_err?: () => void;

    public constructor(ms: number) {
        this.interval = ms;
        this.drift = 0;
    }

    public start(cb: () => void, on_err?: () => void): void {
        this.cb = cb;
        this.on_err = on_err;
        this.expected = Date.now() + this.interval;
        this.timeout = setTimeout(() => { this.step() }, this.interval - this.drift);
        console.log("start: this.timeout="+this.timeout);
    }

    // FIXME this doesn't work.
    public stop(): void {
        console.log("stop: this.timeout="+this.timeout);
        clearTimeout(this.timeout);
        this.timeout = undefined;
    }

    protected step(): void {
        console.log("Timer.step");
        console.log("step: this.timeout="+this.timeout);
        assert(this.expected != null && this.cb != null,
            "must call start before step! this="+this);

        const drift = Date.now() - this.expected!;
        if (drift > this.interval && this.on_err != null) {
            this.on_err();
        }
        this.drift = drift;

        this.cb!();
    }
}

/**
 * A self-adjusting timer with repeated intervals.
 */
class Intervals extends Timer {
    protected step(): void {
        super.step();
        console.log("Intervals.step");
        assert(this.cb != null, "must call start before step!");

        this.start(this.cb!, this.on_err);
    }
}

const intervals = new Intervals(1000);
let n = 0;
intervals.start(
    () => {
        if (++n == 10) {
            intervals.stop();
        }
    }
)
