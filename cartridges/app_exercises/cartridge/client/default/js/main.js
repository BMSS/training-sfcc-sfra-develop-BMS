// // // STEP1:Find the correct template OK
// // // STEP2:Create the anchor to be clicked
// // // STEP3:Create the input to be shown after the anchor is clicked
// // // STEP4-OPTIONAL : Use the only CSS to hide/show events
// // // OBJECTIVE:The client wants the input for the coupon code to be visible after the customer clicks the anchor that says "Click here if you have a coupon code".
// // // Extra point: After implementing with JS, implement it using CSS only.
// // // HINTS:To capture the click event, include your .js file into app_yourcartridge/cartridge/client/default/js/main.js

// // V1
// var yes = "/cartridges/app_exercises/cartridge/templates/default/cart/cartPromoCode.isml";
// <a href="yes" rel="click"></a>
// <h1
// var button = document.createElement("Button");
// button.innerHTML = "If you have a coupon click here.";
// button.style = "top:0;right:0;position:fixed;z-index: 9999"
// button.onclick = function(){
//   var x = document.querySelector("a[rel='click']");
//   window.location.href = x.href;
// }
// document.body.appendChild(button);
