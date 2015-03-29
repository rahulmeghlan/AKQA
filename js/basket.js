var AKQA = {};

(function ($, ns) {

    // Initial data-set
    var products = {cotton: {price: 1.99, qty: 1},
        baseball: {price: 2.99, qty: 2},
        swim: {price: 3.99, qty: 3}};

    // percentage of VAT to be added
    var VAT = 20;

    // Constructor of the basked component of AKQA namespace
    ns.basket = function (productType) {
        if (typeof productType === "undefined") return;
        this.productType = productType;
    };

    // Prototypical child of basket component
    ns.basket.prototype.updateProductQuantity = function (qty) {
        products[this.productType].qty = typeof qty !== "undefined" ? qty : products[this.productType].qty;
        buildProductPrice.apply(this, [$("tr[data-producttype='" + this.productType + "']")]);
    };

    // Local method to calculate individual product price
    var getProductPrice = function (qty) {
        return (qty * (products[this.productType]).price).toFixed(2);
    };

    // Local method to calculate subtotal before calculation of VAT
    var getSubTotal = function () {
        var sum = 0;
        for (var product in products) {
            sum += (products[product].qty * products[product].price);
        }
        return parseFloat(sum.toFixed(2));
    };

    // Local Method to add VAT to the subtotal
    var getVat = function () {
        return parseFloat(((getSubTotal() * VAT) / 100).toFixed(2));
    };

    // Local Method to getTotal of all products
    var getTotal = function () {
        return parseFloat((getSubTotal() + getVat())).toFixed(2);
    };

    // Local method to append the results to HTML
    var buildProductPrice = function ($elem) {
        var qty = products[this.productType].qty;
        $elem.find("input").val(qty);
        $elem.find(".result").text(getProductPrice.call(this, qty));
        buildTotal();
    };

    var buildTotal = function(){
        $(".subtotal input").val(getSubTotal());
        $(".subtotal span").text(getSubTotal());
        $(".vat input").val(getVat());
        $(".vat span").text(getVat());
        $(".total input").val(getTotal());
        $(".total span").text(getTotal());
    }

    // Local method to bind all the events of the form
    var bindEvents = function () {
        var self = this;
        // Handle Add Quantity of individual Items
        $(".add").on("click", function () {
            self.productType = $(this).parents("tr").data("producttype");
            ns[self.productType].updateProductQuantity(++products[self.productType].qty);
        });
        // Handle Subtract Quantity of individual Items
        $(".subtract").on("click", function () {
            self.productType = $(this).parents("tr").data("producttype");
            if (products[self.productType].qty === 0) {
                return false;
            }
            ns[self.productType].updateProductQuantity(--products[self.productType].qty);
        });
        // Handle Change in Quantity of individual Items
        $(".qty").on("keyup change", function () {
            var qty = (new RegExp(/^\d[^\s]*$/)).test($(this).val()) ? parseInt($(this).val()) : 0;
            var time = qty ? 500 : 0;
            var _this = this;
            // Giving some interval to remove and add a new number
            setTimeout(function () {
                self.productType = $(_this).parents("tr").data("producttype");
                ns[self.productType].updateProductQuantity(qty);
            }, time);
        });
        // Handle delete of products
        $(".delete").on("click", function () {
            var $elem = $(this).parents("tr");
            delete products[$elem.data("producttype")];
            $elem.remove();
            buildTotal();
        });
    };

    // Entry point to initialize the data-sets
    var init = function () {
        ns.cotton = new ns.basket("cotton");
        ns.cotton.updateProductQuantity();

        ns.baseball = new ns.basket("baseball");
        ns.baseball.updateProductQuantity();

        ns.swim = new ns.basket("swim");
        ns.swim.updateProductQuantity();

        bindEvents.call(ns.basket);
    };

    // calling the init function
    init();


})(jQuery, AKQA); // Passing jQuery and AKQA namespace to the closure