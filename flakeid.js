const _hex2dec = require("./hex2dec");

class FlakeId {
  constructor(options = {}) {
    this.seq = 0;
    this.mid = (options.mid || 1) % 1023;
    this.timeOffset = options.timeOffset || 0;
    this.lastTime = 0;
  }

  gen () {
    const time = Date.now();
    const bTime = (time - this.timeOffset).toString(2);

    if (this.lastTime == time) {
      this.seq++;

      if (this.seq > 4095) {
        this.seq = 0;

        while (Date.now() <= time) { }
      }
    } else {
      this.seq = 0;
    }

    this.lastTime = time;

    let bSeq = this.seq.toString(2);
    let bMid = this.mid.toString(2);

    while (bSeq.length < 12) {
      bSeq = '0' + bSeq;
    }

    while (bMid.length < 10) {
      bMid = '0' + bMid;
    }

    const bid = bTime + bMid + bSeq;
    let id = '';

    for (var i = bid.length; i >= 0; i -= 4) {
      id = parseInt(bid.substring(i - 4, i), 2).toString(16) + id;
    }

    return _hex2dec.hexToDec(id);
  }
}

module.exports = FlakeId;
