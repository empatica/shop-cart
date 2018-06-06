/// <reference path="./index.d.ts" />

namespace ShopCart {
  export class Utm {
    key: string;
    value: string;
    constructor(k, v) {
      this.key = k;
      this.value = v;
    }
  }
}
