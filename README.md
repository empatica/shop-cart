# ShopCart
ShopCart is a custom cart designed to replace the official [Shopify Buy Button](https://www.shopify.com/buy-button) implementation, giving developers the possibility to fully customize the cart experience for their users.

*PLEASE NOTE*
This product is not associated nor endorsed by Shopify. ShopCart uses undocumented Shopify APIs that are used by the official Buy Button implementation. Shopify can decide to drop the support for these any time without prior notice.


## Install

ShopCart source code and builds can be downloaded from github or via npm.

```
npm install shopify-cart
```

Include ShopCart in your web page as a script before the initialization script. It's recommended to place both these scripts at the end of your page content.


```
<script type="text/javascript" src="./dist/index.min.js"></script>
<script type="text/javascript">
  var config = {
    ...
  };
  var cart = new ShopCart.CartController(config);
</script>
```

## Library versions

Library version files are located in the `./dist` folder of the project.

In order to work, ShopCart requires [store](https://npmjs.com/package/store) to save cart data. If you already have `store` imported in your website or if you want to use a specific version for the library, you can do so by using:

```
index.js
```
> Unminified ShopCart library only

```
index.min.js
```
> Minified ShopCart library only

Otherwise, you can use the following builds that include the `store` library:

```
index.store.js
```
> Unminified library including `store` library

```
index.store.min.js
```
> Minified library including `store` library


## Configuration

Some features of ShopCart can be configured to make it work properly with your store. 

```
{
  "store": {
    "name": "YOUR_STORE_NAME",
    "url": "YOUR_SHOPIFY_STORE_URL"
  },
  "currencies": [
    {
      "name":"United States Dollar",
      "code": "USD",
      "symbol": "$",
      "label": "USD",
      "default": true
    }
  ],
  "image": {
    "basePath":"IMAGE_BASE_PATH",
    "lazyload": true
  },
  "products": [
    {
      "id": "PRODUCT_UNIQUE_ID",
      "name": "PRODUCT_NAME",
      "description": "PRODUCT_DESCRIPTION",
      "price": PRODUCT_PRICE,
      "imageKey": "PRODUCT_IMAGE_KEY",
      "variants": [
        {
          "name": "PRODUCT_VARIANT_NAME",
          "upc": PRODUCT_VARIANT_UPC,
          "sku": "PRODUCT_VARIANT_SKU",
          "imageKey": "PRODUCT_VARIANT_IMAGE_KEY"
        },
        ...
      ]
    }
  ]
}
```


## API

```
ShopCart.getItem(UPC)
```
> Returns the item with the given UPC. If the UPC is not listed in the `config.products` array, `null` value is returned.

```
ShopCart.setItem(UPC)
```
> Adds the item with the given UPC to the cart. If the item is already in the cart, the quantity is incremented. Returns the number of items in the cart for the given UPC.
If the UPC is not listed in the `config.products` array, `null` value is returned.

```
ShopCart.removeItem(UPC)
```
> Removes the item with the given UPC to the cart. If the item is already in the cart, the quantity is decremented. Returns the number of items in the cart for the given UPC.
If the UPC is not listed in the `config.products` array, `null` value is returned.

```
ShopCart.getCheckoutUrl()
```
> Returns the checkout url for the current cart, to which redirect the user for check out the cart and complete the order.

```
ShopCart.openCart()
```
> Refreshes total and quantity and set the class to open the cart.


## Integration

The cart is adding classes to the document to be used for customizing the style

```
body.cart-ready
```
Attached to the body when the cart setup is ready.

```
body.cart-open
```
Attached to the body when the cart setup is open.

```
element.cart-quantity-notification.active
element.store-cart-area.active
element.store-cart-footer.active
```
When cart has at least one element, attach the class `active` to the elment with class `cart-quantity-notification`, `store-cart-area` and `store-cart-footer`.

```
element.store-cart.PRODUCT_ID
```
The `PRODUCT_ID` associated to each product available is attached to each element with class `store-cart`.


## Example
[Empatica Store](https://empatica.com/store)


## Edit and build files

If you want to edit and/or build the source code, you can do so by running 

```
cd ${SHOP_CART_DIRECTORY}
npm install
./node_modules/.bin/gulp build
```

Build files are located in the `./dist` folder of the project.