var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var assert = function (condition, msg) {
    if (!condition) {
        throw new Error(msg);
    }
};
/**
 * A self-adjusting timer.
 */
var Timer = /** @class */ (function () {
    function Timer(ms) {
        this.interval = ms;
        this.drift = 0;
    }
    Timer.prototype.start = function (cb, on_err) {
        var _this = this;
        this.cb = cb;
        this.on_err = on_err;
        this.expected = Date.now() + this.interval;
        this.timeout = setTimeout(function () { _this.step(); }, this.interval - this.drift);
        console.log("start: this.timeout=" + this.timeout);
    };
    // FIXME this doesn't work.
    Timer.prototype.stop = function () {
        console.log("stop: this.timeout=" + this.timeout);
        clearTimeout(this.timeout);
        this.timeout = undefined;
    };
    Timer.prototype.step = function () {
        console.log("Timer.step");
        console.log("step: this.timeout=" + this.timeout);
        assert(this.expected != null && this.cb != null, "must call start before step! this=" + this + "this.expected=" + this.expected + ", this.cb=" + this.cb);
        var drift = Date.now() - this.expected;
        if (drift > this.interval && this.on_err != null) {
            this.on_err();
        }
        this.drift = drift;
        this.cb();
    };
    return Timer;
}());
/**
 * A self-adjusting timer with repeated intervals.
 */
var Intervals = /** @class */ (function (_super) {
    __extends(Intervals, _super);
    function Intervals() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Intervals.prototype.step = function () {
        _super.prototype.step.call(this);
        console.log("Intervals.step");
        assert(this.cb != null, "must call start before step!");
        this.start(this.cb, this.on_err);
    };
    return Intervals;
}(Timer));
var intervals = new Intervals(1000);
var n = 0;
intervals.start(function () {
    if (++n == 10) {
        intervals.stop();
    }
});
