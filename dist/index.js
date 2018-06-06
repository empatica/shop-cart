var ShopCartConst;
(function (ShopCartConst) {
    ShopCartConst.STORAGE_CART = "cart";
    ShopCartConst.STORAGE_UTM = "utm";
    ShopCartConst.CLASS_BODY_CART_READY = "cart-ready";
    ShopCartConst.CLASS_BODY_CART_OPEN = "cart-open";
    ShopCartConst.CLASS_CART_ACTION = "cart-action";
    ShopCartConst.CLASS_CART_EMPTY = "empty";
    ShopCartConst.CLASS_CART_OPEN = "open";
    ShopCartConst.SELECTOR_CART = "#store-cart";
    ShopCartConst.SELECTOR_CART_ACTION = ".cart-action";
    ShopCartConst.SELECTOR_CART_ITEM_LIST = "#cart-item-list";
    ShopCartConst.SELECTOR_CART_TOTAL_PRICE = ".cart-total-price";
    ShopCartConst.SELECTOR_CART_TOTAL_COUNT = ".cart-total-count";
    ShopCartConst.ACTION_ADD = "add";
    ShopCartConst.ACTION_REMOVE = "remove";
    ShopCartConst.DATA_ACTION = "action";
    ShopCartConst.DATA_UPC = "upc";
    ShopCartConst.CLASS_ITEM_QUANTITY = "quantity";
    ShopCartConst.CLASS_ITEM = "cart-item";
    ShopCartConst.SELECTOR_ITEM_QUANTITY = ".quantity";
    ShopCartConst.CLASS_ELEMENT_ACTIVE = "active";
    ShopCartConst.SELECTOR_ELEMENT_CART_AREA = ".cart-area";
    ShopCartConst.SELECTOR_ELEMENT_CART_NOTIFICATION = ".cart-notification";
    ShopCartConst.PREFIX_CART_IMAGE = "cart_";
    ShopCartConst.PREFIX_DATA = "data-";
    ShopCartConst.PREFIX_ITEM = "item-";
    ShopCartConst.ADD_EVT = "shop-cart-add";
    ShopCartConst.REMOVE_EVT = "shop-cart-remove";
    ShopCartConst.OPEN_EVT = "shop-cart-open";
    ShopCartConst.CLOSE_EVT = "shop-cart-close";
    ShopCartConst.INIT_EVT = "shop-cart-init";
    ShopCartConst.READY_EVT = "shop-cart-init";
})(ShopCartConst || (ShopCartConst = {}));

;var ShopCart;
(function (ShopCart) {
    ShopCart.CART_INVALID_BEFORE = 1515076732673;
    var Cart = (function () {
        function Cart(currency, cart) {
            if (cart === void 0) { cart = null; }
            if (!cart) {
                this.id = this.getId();
                this.createdAt = new Date().getTime();
                this.currency = currency;
                this.items = [];
                this.total = 0;
                this.quantity = 0;
            }
            else {
                this.init(cart);
            }
        }
        Cart.prototype.setItem = function (i) {
            var exists = false;
            var q = 0;
            this.items.map(function (ic) {
                if (ic.item.upc == i.upc) {
                    ic.quantity++;
                    exists = true;
                    q = ic.quantity;
                }
                return ic;
            });
            if (!exists) {
                this.items.push(new ShopCart.CartItem(i, 1));
                q = 1;
            }
            return q;
        };
        Cart.prototype.removeItem = function (i) {
            var q = 0;
            this.items.map(function (ic) {
                if (ic.item.upc == i.upc) {
                    if (ic.quantity > 0) {
                        ic.quantity--;
                    }
                    q = ic.quantity;
                }
                return ic;
            });
            return q;
        };
        Cart.prototype.init = function (cart) {
            this.id = cart.id;
            this.createdAt = cart.createdAt;
            this.currency = cart.currency;
            this.total = cart.total;
            this.quantity = cart.quantity;
            this.initItems(cart.items);
        };
        Cart.prototype.initItems = function (items) {
            this.items = [];
            for (var i = 0; i < items.length; i++) {
                this.items.push(new ShopCart.CartItem(items[i].item, items[i].quantity));
            }
        };
        Cart.prototype.getId = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            var id = s4() +
                s4() +
                "-" +
                s4() +
                "-" +
                s4() +
                "-" +
                s4() +
                "-" +
                s4() +
                s4() +
                s4() +
                "-" +
                Date.now();
            return id;
        };
        return Cart;
    }());
    ShopCart.Cart = Cart;
    var cartProps = [
        "id",
        "createdAt",
        "total",
        ,
        "quantity",
        "items",
        "currency"
    ];
    function isValidCart(cart) {
        if (!cart ||
            !cart.createdAt ||
            cart.createdAt < ShopCart.CART_INVALID_BEFORE) {
            return false;
        }
        var v = true;
        for (var i = 0; i < cartProps.length; i++) {
            v = v && (!cartProps[i] || cart[cartProps[i]] !== undefined);
        }
        return v;
    }
    ShopCart.isValidCart = isValidCart;
})(ShopCart || (ShopCart = {}));

;var ShopCart;
(function (ShopCart) {
    var Config = (function () {
        function Config(config) {
            if (!config) {
                throw new Error("Config is missing");
            }
            this.store = new ShopCart.ConfigStore(config.store);
            this.image = new ShopCart.ConfigImage(config.image);
            this.currencies = config.currencies;
            this.currency = this.getDefaultCurrency();
            this.products = config.products;
            this.selector = new ShopCart.ConfigSelector(config.selector);
            this.selectorClass = new ShopCart.ConfigSelectorClass(config.selectorClass);
        }
        Config.prototype.getDefaultCurrency = function () {
            var defCurr = {
                name: "United States Dollar",
                label: "USD",
                code: "USD",
                symbol: "$",
                default: true
            };
            if (!this.currencies || this.currencies.length == 0) {
                return defCurr;
            }
            var list = this.currencies.filter(function (c) {
                return c.default;
            });
            if (!list || list.length == 0) {
                return this.currencies[0];
            }
            return list[0];
        };
        return Config;
    }());
    ShopCart.Config = Config;
    var ConfigStore = (function () {
        function ConfigStore(config) {
            if (!config) {
                throw new Error("Store config is missing");
            }
            this.name = config.name;
            this.url = config.url;
        }
        return ConfigStore;
    }());
    ShopCart.ConfigStore = ConfigStore;
    var ConfigImage = (function () {
        function ConfigImage(config) {
            if (config === void 0) { config = null; }
            this.basePath = config && config.basePath ? config.basePath : "./images/";
            this.lazyload = Boolean(config.lazyload);
        }
        return ConfigImage;
    }());
    ShopCart.ConfigImage = ConfigImage;
    var ConfigSelector = (function () {
        function ConfigSelector(config) {
            if (config === void 0) { config = null; }
            if (!config) {
                config = {
                    cart: null,
                    body: "body",
                    element: null
                };
            }
            this.cart = new ShopCart.ConfigSelectorCart(config.cart);
            this.body = config.body;
            this.element = new ShopCart.ConfigSelectorElement(config.element);
        }
        return ConfigSelector;
    }());
    ShopCart.ConfigSelector = ConfigSelector;
    var ConfigSelectorClass = (function () {
        function ConfigSelectorClass(config) {
            if (config === void 0) { config = null; }
            if (!config) {
                config = {
                    cart: null,
                    body: null,
                    element: null
                };
            }
            this.cart = new ShopCart.ConfigSelectorClassCart(config.cart);
            this.body = new ShopCart.ConfigSelectorClassBody(config.body);
            this.element = new ShopCart.ConfigSelectorClassElement(config.element);
        }
        return ConfigSelectorClass;
    }());
    ShopCart.ConfigSelectorClass = ConfigSelectorClass;
    var ConfigSelectorCart = (function () {
        function ConfigSelectorCart(config) {
            if (config === void 0) { config = null; }
            this.main =
                config && config.main ? config.main : ShopCartConst.SELECTOR_CART;
            this.total =
                config && config.total
                    ? config.total
                    : ShopCartConst.SELECTOR_CART_TOTAL_PRICE;
            this.count =
                config && config.count
                    ? config.count
                    : ShopCartConst.SELECTOR_CART_TOTAL_COUNT;
        }
        return ConfigSelectorCart;
    }());
    ShopCart.ConfigSelectorCart = ConfigSelectorCart;
    var ConfigSelectorClassCart = (function () {
        function ConfigSelectorClassCart(config) {
            if (config === void 0) { config = null; }
            this.open =
                config && config.open ? config.open : ShopCartConst.CLASS_CART_OPEN;
            this.empty =
                config && config.empty ? config.empty : ShopCartConst.CLASS_CART_EMPTY;
        }
        return ConfigSelectorClassCart;
    }());
    ShopCart.ConfigSelectorClassCart = ConfigSelectorClassCart;
    var ConfigSelectorClassBody = (function () {
        function ConfigSelectorClassBody(config) {
            if (config === void 0) { config = null; }
            this.cartReady =
                config && config.cartReady
                    ? config.cartReady
                    : ShopCartConst.CLASS_BODY_CART_READY;
            this.cartOpen =
                config && config.cartOpen
                    ? config.cartOpen
                    : ShopCartConst.CLASS_BODY_CART_OPEN;
        }
        return ConfigSelectorClassBody;
    }());
    ShopCart.ConfigSelectorClassBody = ConfigSelectorClassBody;
    var ConfigSelectorElement = (function () {
        function ConfigSelectorElement(config) {
            if (config === void 0) { config = null; }
            this.main =
                config && config.main
                    ? config.main
                    : ShopCartConst.SELECTOR_ELEMENT_CART_AREA;
            this.notification =
                config && config.notification
                    ? config.notification
                    : ShopCartConst.SELECTOR_ELEMENT_CART_NOTIFICATION;
        }
        return ConfigSelectorElement;
    }());
    ShopCart.ConfigSelectorElement = ConfigSelectorElement;
    var ConfigSelectorClassElement = (function () {
        function ConfigSelectorClassElement(config) {
            if (config === void 0) { config = null; }
            this.active =
                config && config.active
                    ? config.active
                    : ShopCartConst.CLASS_ELEMENT_ACTIVE;
        }
        return ConfigSelectorClassElement;
    }());
    ShopCart.ConfigSelectorClassElement = ConfigSelectorClassElement;
})(ShopCart || (ShopCart = {}));

;function getElemData(t, d) {
    if (t.dataset) {
        return t.dataset[d];
    }
    return t.getAttribute(ShopCartConst.PREFIX_DATA + d);
}
var ShopCart;
(function (ShopCart) {
    ShopCart.variantProductMap = [];
    ShopCart.productVariantsImageMap = [];
    ShopCart.variantMap = [];
    var CartController = (function () {
        function CartController(config, storage, cart) {
            if (storage === void 0) { storage = null; }
            if (cart === void 0) { cart = null; }
            if (!config) {
                throw Error("Store configuration is missing");
            }
            if (!storage) {
                if (!window.store) {
                    throw Error("Storage is missing");
                }
                storage = window.store;
            }
            if (!cart) {
                cart = window.store.get(ShopCartConst.STORAGE_CART);
            }
            this.dispatcher = new ShopCart.Dispatcher();
            this.dispatcher.init();
            this.setConfig(config);
            this.storage = storage;
            this.setUtm();
            cart = ShopCart.isValidCart(cart)
                ? new ShopCart.Cart(cart.currency, cart)
                : new ShopCart.Cart(this.config.currency);
            this.cart = cart;
            this.setTotal();
            this.ready();
        }
        CartController.prototype.getItem = function (upc) {
            var p = ShopCart.variantProductMap[upc];
            var v = ShopCart.variantMap[upc];
            if (!upc || !p || !v) {
                return null;
            }
            return new ShopCart.Item(upc, p, v);
        };
        CartController.prototype.setItem = function (upc) {
            var i = this.getItem(upc);
            if (!i) {
                return null;
            }
            var q = this.cart.setItem(i);
            this.dispatcher.add(upc);
            this.openCart();
            this.setTotal();
            return q;
        };
        CartController.prototype.removeItem = function (upc) {
            var i = this.getItem(upc);
            if (!i) {
                return null;
            }
            var q = this.cart.removeItem(i);
            this.dispatcher.remove(upc);
            this.setTotal();
            return q;
        };
        CartController.prototype.getCheckoutUrl = function () {
            var storeUrl = this.config.store.url;
            if (storeUrl[storeUrl.length - 1] != "/") {
                storeUrl += "/";
            }
            var url = storeUrl + "cart/";
            if (this.cart.quantity <= 0) {
                return null;
            }
            for (var i = 0; i < this.cart.items.length; i++) {
                if (this.cart.items[i].quantity <= 0) {
                    continue;
                }
                url +=
                    this.cart.items[i].item.upc + ":" + this.cart.items[i].quantity + ",";
            }
            if (this.utm && this.utm.length > 0) {
                url += "?";
                this.utm.forEach(function (u) {
                    url += u.key + "=" + u.value + "&";
                });
            }
            return url;
        };
        CartController.prototype.openCart = function () {
            this.updateCartQuantities();
            this.elementLoop(this.config.selector.cart.main, function (e, self) {
                if (e.className.indexOf(self.config.selectorClass.cart.open) >= 0) {
                    return;
                }
                e.className += " " + self.config.selectorClass.cart.open;
                var h = "";
                for (var i = 0; i < self.cart.items.length; i++) {
                    if (self.cart.items[i].quantity > 0) {
                        var n = self.createCartItem(self.cart.items[i]);
                    }
                }
            });
            if (document.body.className.indexOf(this.config.selectorClass.body.cartOpen) < 0) {
                document.body.className +=
                    " " + this.config.selectorClass.body.cartOpen;
                this.dispatcher.open();
            }
        };
        CartController.prototype.elementLoop = function (query, callback) {
            var l = document.querySelectorAll(query);
            for (var i = 0; i < l.length; i++) {
                callback(l[i], this);
            }
        };
        CartController.prototype.registerCartItemEvents = function (n) {
            var l = n.querySelectorAll(ShopCartConst.SELECTOR_CART_ACTION);
            for (var i = 0; i < l.length; i++) {
                this.registerCartActionEvent(l[i]);
                this.events[getElemData(l[i], ShopCartConst.DATA_UPC) +
                    "-" +
                    getElemData(l[i], ShopCartConst.DATA_ACTION)] = true;
            }
            l = n.querySelectorAll("input" + ShopCartConst.SELECTOR_ITEM_QUANTITY);
            for (var i = 0; i < l.length; i++) {
                this.registerCartUpdateEvent(l[i]);
            }
        };
        CartController.prototype.registerCartUpdateEvent = function (el) {
            var self = this;
            el.addEventListener("input", function (e) {
                var v = e.target.value;
                if (v) {
                    var q = parseInt(v);
                    if (isNaN(q)) {
                        return;
                    }
                    self.setItemQuantity(getElemData(e.target, ShopCartConst.DATA_UPC), q);
                }
            });
        };
        CartController.prototype.registerCartActionEvent = function (el) {
            var self = this;
            if (!this.events) {
                this.events = {};
            }
            if (this.events[getElemData(el, ShopCartConst.DATA_UPC)]) {
                return;
            }
            this.events[getElemData(el, ShopCartConst.DATA_UPC) +
                "-" +
                getElemData(el, ShopCartConst.DATA_ACTION)] = true;
            el.addEventListener("click", function (e) {
                var upc = getElemData(e.target, ShopCartConst.DATA_UPC);
                switch (getElemData(e.target, ShopCartConst.DATA_ACTION)) {
                    case ShopCartConst.ACTION_ADD:
                        var q = self.setItem(upc);
                        self.updateCartQuantities();
                        break;
                    case ShopCartConst.ACTION_REMOVE:
                        var q = self.removeItem(upc);
                        self.updateCartQuantities();
                        break;
                }
            });
        };
        CartController.prototype.setItemQuantity = function (upc, quantity) {
            var i = this.getItem(upc);
            if (!i) {
                return null;
            }
            var exists = false;
            var q = 0;
            this.cart.items.map(function (ic) {
                if (ic.item.upc == upc) {
                    ic.quantity = quantity;
                    exists = true;
                    q = ic.quantity;
                }
                return ic;
            });
            if (!exists) {
                this.cart.items.push(new ShopCart.CartItem(i, quantity));
                q = 1;
            }
            this.openCart();
            this.setTotal();
            return q;
        };
        CartController.prototype.createCartItem = function (i) {
            if (i.quantity > 0 &&
                !document.getElementById(ShopCartConst.PREFIX_ITEM + i.item.upc)) {
                var n = document.createElement("div");
                n.className = ShopCartConst.CLASS_ITEM;
                n.id = ShopCartConst.PREFIX_ITEM + i.item.upc;
                n.innerHTML = i.getTemplate(this.config);
                document
                    .querySelector(ShopCartConst.SELECTOR_CART_ITEM_LIST)
                    .appendChild(n);
                this.registerCartItemEvents(n);
            }
            else {
                this.updateItemQuantity(i);
            }
        };
        CartController.prototype.updateCartQuantities = function () {
            for (var i = 0; i < this.cart.items.length; i++) {
                this.createCartItem(this.cart.items[i]);
                this.updateItemQuantity(this.cart.items[i]);
            }
        };
        CartController.prototype.updateItemQuantity = function (i) {
            var n = document.querySelectorAll("#" + ShopCartConst.PREFIX_ITEM + i.item.upc), q = document.querySelectorAll("#" +
                ShopCartConst.PREFIX_ITEM +
                i.item.upc +
                " " +
                ShopCartConst.SELECTOR_ITEM_QUANTITY);
            if (q && q.length > 0) {
                if (i.quantity <= 0) {
                    document
                        .querySelector(ShopCartConst.SELECTOR_CART_ITEM_LIST)
                        .removeChild(n[0]);
                    return;
                }
                for (var j = 0; j < q.length; j++) {
                    q[j].value = i.quantity.toString();
                }
            }
        };
        CartController.prototype.setTotal = function () {
            var t = 0, q = 0;
            for (var i = 0; i < this.cart.items.length; i++) {
                t +=
                    this.cart.items[i].item.product.price * this.cart.items[i].quantity;
                q += this.cart.items[i].quantity > 0 ? this.cart.items[i].quantity : 0;
            }
            this.cart.total = t;
            this.cart.quantity = q;
            this.updateCartTotal();
            this.updateCart();
            return t;
        };
        CartController.prototype.setUtm = function () {
            this.utm = this.getUrlUtm();
            if (this.utm && this.utm.length > 0) {
                this.storage.set(ShopCartConst.STORAGE_UTM, this.utm);
            }
            else {
                this.utm = this.getUtm();
            }
        };
        CartController.prototype.getUtm = function () {
            return this.storage.get(ShopCartConst.STORAGE_UTM);
        };
        CartController.prototype.getUrlUtm = function () {
            var utm = [];
            var utmPrefix = "utm_";
            var url = window.location.href.trim();
            if (url.indexOf("?") < 0 || url.indexOf(utmPrefix) < 0) {
                return utm;
            }
            var q = url.split("?")[1];
            var regex = new RegExp("^" + utmPrefix + "?[a-zA-Z0-9]*");
            q.split("&").forEach(function (p) {
                if (regex.test(p)) {
                    var i = p.split("=");
                    utm.push(new ShopCart.Utm(i[0], i[1]));
                }
            });
            return utm;
        };
        CartController.prototype.updateCart = function () {
            this.storage.set(ShopCartConst.STORAGE_CART, this.cart);
            this.updateCartNotification();
            this.updateCartCheckoutButton();
            this.updateCartActive();
            return;
        };
        CartController.prototype.updateCartTotal = function () {
            var t = document.querySelectorAll(this.config.selector.cart.total);
            for (var i = 0; i < t.length; i++) {
                t[i].innerHTML =
                    this.cart.total.toFixed(2) + " " + this.cart.currency.label;
            }
            var t = document.querySelectorAll(this.config.selector.cart.count);
            for (var i = 0; i < t.length; i++) {
                t[i].innerHTML = this.cart.quantity.toString();
            }
        };
        CartController.prototype.updateCartCheckoutButton = function () {
            this.elementLoop(this.config.selector.cart.main, function (e, self) {
                if (self.cart.quantity > 0) {
                    e.className = e.className
                        .replace(self.config.selectorClass.cart.empty, "")
                        .trim();
                    self.setCartProductClass();
                }
                else {
                    if (e.className.indexOf(self.config.selectorClass.cart.empty) < 0) {
                        e.className += " " + self.config.selectorClass.cart.empty;
                    }
                }
            });
        };
        CartController.prototype.setCartProductClass = function () {
            this.elementLoop(this.config.selector.cart.main, function (e, self) {
                for (var j = 0; j < self.config.products.length; j++) {
                    var id = self.config.products[j].id;
                    e.className = e.className.replace(id, "").trim();
                }
                for (var j = 0; j < self.cart.items.length; j++) {
                    if (self.cart.items[j].quantity > 0) {
                        var p = ShopCart.variantProductMap[self.cart.items[j].item.upc];
                        if (e.className.indexOf(p.id) < 0) {
                            e.className += " " + p.id;
                        }
                    }
                }
            });
        };
        CartController.prototype.updateCartActive = function () {
            this.elementLoop(this.config.selector.element.main, function (e, self) {
                if (self.cart.quantity > 0) {
                    if (e.className.indexOf(self.config.selectorClass.element.active) < 0) {
                        e.className += " " + self.config.selectorClass.element.active;
                    }
                }
                else {
                    e.className = e.className
                        .replace(self.config.selectorClass.element.active, "")
                        .trim();
                }
            });
        };
        CartController.prototype.updateCartNotification = function () {
            this.elementLoop(this.config.selector.element.notification, function (e, self) {
                if (self.cart.quantity > 0) {
                    e.innerHTML = self.cart.quantity.toString();
                    if (e.className.indexOf(self.config.selectorClass.element.active) < 0) {
                        e.className += " " + self.config.selectorClass.element.active;
                    }
                }
                else {
                    e.className = e.className
                        .replace(self.config.selectorClass.element.active, "")
                        .trim();
                }
            });
        };
        CartController.prototype.ready = function () {
            this.dispatcher.ready();
            return (document.body.className +=
                " " + this.config.selectorClass.body.cartReady);
        };
        CartController.prototype.setConfig = function (config) {
            if (!config.store || !config.store.url) {
                throw Error("Store url is missing");
            }
            this.config = new ShopCart.Config(config);
            for (var i = 0; i < config.products.length; i++) {
                var p = config.products[i];
                for (var j = 0; j < p.variants.length; j++) {
                    ShopCart.variantProductMap[p.variants[j].upc] = new ShopCart.Product(p.id, p.name, p.price, p.description, p.image.url);
                    ShopCart.productVariantsImageMap[p.variants[j].upc] = new ShopCart.ProductImage(p.variants[j].image.url);
                    ShopCart.variantMap[p.variants[j].upc] = new ShopCart.ProductVariant(p.variants[j].name, p.variants[j].upc, p.variants[j].sku, p.variants[j].size, p.variants[j].image.url);
                }
            }
        };
        return CartController;
    }());
    ShopCart.CartController = CartController;
})(ShopCart || (ShopCart = {}));

;var ShopCart;
(function (ShopCart) {
    var Currency = (function () {
        function Currency() {
        }
        return Currency;
    }());
    ShopCart.Currency = Currency;
})(ShopCart || (ShopCart = {}));

;var ShopCart;
(function (ShopCart) {
    var Dispatcher = (function () {
        function Dispatcher() {
            this.polyfill();
            this.addEvtRepo = {};
            this.removeEvtRepo = {};
            this.openEvt = this.createEvt(ShopCartConst.OPEN_EVT);
            this.closeEvt = this.createEvt(ShopCartConst.CLOSE_EVT);
            this.initEvt = this.createEvt(ShopCartConst.INIT_EVT);
            this.readyEvt = this.createEvt(ShopCartConst.READY_EVT);
        }
        Dispatcher.prototype.add = function (upc) {
            if (!this.addEvtRepo[upc]) {
                this.addEvtRepo[upc] = this.createEvt(ShopCartConst.ADD_EVT, upc.toString());
            }
            return window.dispatchEvent(this.addEvtRepo[upc]);
        };
        Dispatcher.prototype.remove = function (upc) {
            if (!this.removeEvtRepo[upc]) {
                this.removeEvtRepo[upc] = this.createEvt(ShopCartConst.REMOVE_EVT, upc.toString());
            }
            return window.dispatchEvent(this.removeEvtRepo[upc]);
        };
        Dispatcher.prototype.open = function () {
            if (!this.openEvt) {
                return;
            }
            return window.dispatchEvent(this.openEvt);
        };
        Dispatcher.prototype.close = function () {
            if (!this.closeEvt) {
                return;
            }
            return window.dispatchEvent(this.closeEvt);
        };
        Dispatcher.prototype.init = function () {
            if (!this.initEvt) {
                return;
            }
            return window.dispatchEvent(this.initEvt);
        };
        Dispatcher.prototype.ready = function () {
            if (!this.readyEvt) {
                return;
            }
            return window.dispatchEvent(this.readyEvt);
        };
        Dispatcher.prototype.createEvt = function (evt, detail) {
            if (detail === void 0) { detail = null; }
            return new window.CustomEvent(evt, { detail: detail });
        };
        Dispatcher.prototype.polyfill = function () {
            if (typeof window.CustomEvent === "function")
                return false;
            function CustomEvent(event, params) {
                params = params || {
                    bubbles: false,
                    cancelable: false,
                    detail: undefined
                };
                var evt = document.createEvent("CustomEvent");
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            }
            CustomEvent.prototype = window.Event.prototype;
            window.CustomEvent = CustomEvent;
        };
        return Dispatcher;
    }());
    ShopCart.Dispatcher = Dispatcher;
})(ShopCart || (ShopCart = {}));

;var ShopCart;
(function (ShopCart) {
    var Item = (function () {
        function Item(upc, product, productVariant) {
            this.upc = upc;
            this.product = product;
            this.productvariant = productVariant;
        }
        return Item;
    }());
    ShopCart.Item = Item;
    var CartItem = (function () {
        function CartItem(item, quantity) {
            if (quantity === void 0) { quantity = 0; }
            this.item = item;
            this.quantity = quantity;
        }
        CartItem.prototype.getTemplate = function (config) {
            if (config === void 0) { config = null; }
            var t = "";
            var product = ShopCart.variantProductMap[this.item.upc];
            var image = ShopCart.productVariantsImageMap[this.item.upc];
            var imageBasePath = config && config.image && config.image.basePath
                ? config.image.basePath
                : "./images/";
            t += "<table><tr>";
            t += '<td class="product-image">';
            if (image && image.url) {
                t += '<img src="' + imageBasePath + image.url + '">';
            }
            t += "</td>";
            t +=
                '<td class="product-details"><div class="product-name">' +
                    product.name +
                    "</div>";
            if (this.item.productvariant.name) {
                t +=
                    '<div class="item-name">Color: ' +
                        this.item.productvariant.name +
                        "</div>";
            }
            if (this.item.productvariant.size) {
                t +=
                    '<div class="item-size">Size: ' +
                        this.item.productvariant.size +
                        "</div>";
            }
            t += '<div class="input-group">';
            t +=
                '<button class="minus ' +
                    ShopCartConst.CLASS_CART_ACTION +
                    '" data-upc="' +
                    this.item.upc +
                    '" data-sku="' +
                    this.item.productvariant.sku +
                    '" data-product="' +
                    product.name +
                    '" data-price="' +
                    product.price +
                    '" data-label="' +
                    this.item.productvariant.name +
                    '" data-action="remove"></button>';
            t +=
                '<input class="' +
                    ShopCartConst.CLASS_ITEM_QUANTITY +
                    ' form-control hidden-xs"  min="0" type="text" value="' +
                    this.quantity +
                    '" data-upc="' +
                    this.item.upc +
                    '"></input>';
            t +=
                '<input class="' +
                    ShopCartConst.CLASS_ITEM_QUANTITY +
                    ' form-control visible-xs" disabled="disabled"  min="0" type="text" value="' +
                    this.quantity +
                    '" data-upc="' +
                    this.item.upc +
                    '"></input>';
            t +=
                '<button class="plus ' +
                    ShopCartConst.CLASS_CART_ACTION +
                    '" data-upc="' +
                    this.item.upc +
                    '" data-sku="' +
                    this.item.productvariant.sku +
                    '" data-product="' +
                    product.name +
                    '" data-price="' +
                    product.price +
                    '" data-label="' +
                    this.item.productvariant.name +
                    '" data-action="add"></button>';
            t += "</div></td>";
            t += '<td class="product-price">';
            t += '<div class="item-price">' + product.price.toFixed(2) + "</div>";
            t += "</td>";
            t += "</tr></table>";
            return t;
        };
        return CartItem;
    }());
    ShopCart.CartItem = CartItem;
})(ShopCart || (ShopCart = {}));

;var ShopCart;
(function (ShopCart) {
    var ProductImage = (function () {
        function ProductImage(url) {
            this.url = url;
            this.setKey(this.url);
        }
        ProductImage.prototype.setKey = function (url) {
            if (!url) {
                return;
            }
            var a = url.substring(url.lastIndexOf("/") + 1), b = a.lastIndexOf(".");
            this.key = b > 0 ? a.substr(0, b) : a;
        };
        return ProductImage;
    }());
    ShopCart.ProductImage = ProductImage;
    var ProductVariant = (function () {
        function ProductVariant(name, upc, sku, size, imageUrl) {
            if (size === void 0) { size = null; }
            if (imageUrl === void 0) { imageUrl = null; }
            this.name = name;
            this.upc = upc;
            this.sku = sku;
            this.size = size;
            this.image = imageUrl ? new ProductImage(imageUrl) : null;
        }
        return ProductVariant;
    }());
    ShopCart.ProductVariant = ProductVariant;
    var Product = (function () {
        function Product(id, name, price, description, imageUrl, variants) {
            if (description === void 0) { description = null; }
            if (imageUrl === void 0) { imageUrl = null; }
            if (variants === void 0) { variants = null; }
            this.id = id;
            this.name = name;
            this.price = price;
            this.description = description ? description : "";
            this.image = imageUrl ? new ProductImage(imageUrl) : null;
            this.variants = variants ? variants : [];
        }
        return Product;
    }());
    ShopCart.Product = Product;
})(ShopCart || (ShopCart = {}));

;var ShopCart;
(function (ShopCart) {
    var Utm = (function () {
        function Utm(k, v) {
            this.key = k;
            this.value = v;
        }
        return Utm;
    }());
    ShopCart.Utm = Utm;
})(ShopCart || (ShopCart = {}));
