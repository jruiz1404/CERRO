sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
  ], (Controller, MessageBox, MessageToast) => {
    "use strict";
  
    var prefixId;
    var oScanResultText;
  
    return Controller.extend("cerro.dsi.controller.Main", {
        onInit() {
        },

        onCordoba: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Cordoba");
          },
    });
  });