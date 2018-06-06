/// <reference path="./index.d.ts" />

namespace ShopCart {
  export class ProductImage {
    url: string;
    key: string;

    constructor(url: string) {
      this.url = url;
      this.setKey(this.url);
    }

    private setKey(url) {
      if (!url) {
        return;
      }
      var a = url.substring(url.lastIndexOf("/") + 1),
        b = a.lastIndexOf(".");
      this.key = b > 0 ? a.substr(0, b) : a;
    }
  }

  export class ProductVariant {
    name: string;
    upc: number;
    sku: string;
    size: string;
    image: ProductImage;
    constructor(
      name: string,
      upc: number,
      sku: string,
      size: string = null,
      imageUrl: string = null
    ) {
      this.name = name;
      this.upc = upc;
      this.sku = sku;
      this.size = size;
      this.image = imageUrl ? new ProductImage(imageUrl) : null;
    }
  }

  export class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: ProductImage;
    variants: Array<ProductVariant>;
    constructor(
      id: string,
      name: string,
      price: number,
      description: string = null,
      imageUrl: string = null,
      variants: Array<ProductVariant> = null
    ) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.description = description ? description : "";
      this.image = imageUrl ? new ProductImage(imageUrl) : null;
      this.variants = variants ? variants : [];
    }
  }
}
