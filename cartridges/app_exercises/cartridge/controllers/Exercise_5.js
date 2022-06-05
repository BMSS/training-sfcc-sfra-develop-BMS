'use strict'

var server = require('server')

// server.get('Form',function(req,res,next){
    
//     res.render('form/Exercise_5.isml');
//     return next;
// });
server.get(
    'Begin',
    server.middleware.https,
    // consentTracking.consent,
    // csrfProtection.generateToken,
    function (req, res, next) {
        var BasketMgr = require('dw/order/BasketMgr');
        var Transaction = require('dw/system/Transaction');
        var AccountModel = require('*/cartridge/models/account');
        var OrderModel = require('*/cartridge/models/order');
        var URLUtils = require('dw/web/URLUtils');
        var reportingUrlsHelper = require('*/cartridge/scripts/reportingUrls');
        var Locale = require('dw/util/Locale');
        var collections = require('*/cartridge/scripts/util/collections');
        var validationHelpers = require('*/cartridge/scripts/helpers/basketValidationHelpers');

        var currentBasket = BasketMgr.getCurrentBasket();
        if (!currentBasket) {
            res.redirect(URLUtils.url('Cart-Show'));
            return next();
        }

        var validatedProducts = validationHelpers.validateProducts(currentBasket);
        if (validatedProducts.error) {
            res.redirect(URLUtils.url('Cart-Show'));
            return next();
        }

        var currentStage = req.querystring.stage ? req.querystring.stage : 'shipping';

        var billingAddress = currentBasket.billingAddress;

        var currentCustomer = req.currentCustomer.raw;
        var currentLocale = Locale.getLocale(req.locale.id);
        var preferredAddress;

        // only true if customer is registered
        if (req.currentCustomer.addressBook && req.currentCustomer.addressBook.preferredAddress) {
            var shipments = currentBasket.shipments;
            preferredAddress = req.currentCustomer.addressBook.preferredAddress;

            collections.forEach(shipments, function (shipment) {
                if (!shipment.shippingAddress) {
                    COHelpers.copyCustomerAddressToShipment(preferredAddress, shipment);
                }
            });

            if (!billingAddress) {
                COHelpers.copyCustomerAddressToBilling(preferredAddress);
            }
        }

        // Calculate the basket
        // Transaction.wrap(function () {
        //     COHelpers.ensureNoEmptyShipments(req);
        // });

        if (currentBasket.shipments.length <= 1) {
            req.session.privacyCache.set('usingMultiShipping', false);
        }

        if (currentBasket.currencyCode !== req.session.currency.currencyCode) {
            Transaction.wrap(function () {
                currentBasket.updateCurrency();
            });
        }

        // COHelpers.recalculateBasket(currentBasket);

        // var shippingForm = COHelpers.prepareShippingForm(currentBasket);
        // var billingForm = COHelpers.prepareBillingForm(currentBasket);
        var usingMultiShipping = req.session.privacyCache.get('usingMultiShipping');

        if (preferredAddress) {
            shippingForm.copyFrom(preferredAddress);
            billingForm.copyFrom(preferredAddress);
        }

        // Loop through all shipments and make sure all are valid
        // var allValid = COHelpers.ensureValidShipments(currentBasket);

        // var orderModel = new OrderModel(
        //     currentBasket,
        //     {
        //         customer: currentCustomer,
        //         usingMultiShipping: usingMultiShipping,
        //         shippable: allValid,
        //         countryCode: currentLocale.country,
        //         containerView: 'basket'
        //     }
        // );

        // Get rid of this from top-level ... should be part of OrderModel???
        var currentYear = new Date().getFullYear();
        var creditCardExpirationYears = [];

        for (var j = 0; j < 10; j++) {
            creditCardExpirationYears.push(currentYear + j);
        }

        var accountModel = new AccountModel(req.currentCustomer);

        var reportingURLs;
        reportingURLs = reportingUrlsHelper.getCheckoutReportingURLs(
            currentBasket.UUID,
            2,
            'Shipping'
        );

        res.render('form/Exercise_5.isml', {
            // order: orderModel,
            // customer: accountModel,
            // forms: {
            //     shippingForm: shippingForm,
            //     billingForm: billingForm
            // },
            // expirationYears: creditCardExpirationYears,
            // currentStage: currentStage,
            // reportingURLs: reportingURLs
        });

        return next();
    }
);


module.exports = server.exports();