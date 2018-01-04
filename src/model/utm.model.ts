/// <reference path="./index.d.ts" />

module ShopCart {
  export class Utm {
    key: string
    value: string
    constructor(k, v) {
      this.key = k;
      this.value = v;
    }
  }
}