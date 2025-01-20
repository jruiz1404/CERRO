sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
], (Controller, MessageBox, MessageToast) => {
  "use strict";

   return Controller.extend("cerro.dsi.controller.CbaMovimiento", {
    
    onInit: function () {
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this._oRouter.attachRouteMatched(this.handleRouteMatched, this);
    },

    handleRouteMatched : function (evt) {
      // Limpio cada vez que ingreso el valor de orden 
      var order = this.getView().byId("InpCbaMov");
      order.setValue('');

    },


    // Navegacion Paginas        
    onNavBack: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("Cordoba");
    },


    // //  Funcionalidades
    onCbaMov: function () {

      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      var order = this.getView().byId("InpCbaMov").getValue();

      if (order != "") {

        let data = order;
        oRouter.navTo("CbaMovUbic", { data: data });

      }

    },

    // Scan Codigo de barras
    onScanSuccessMov: function (oEvent) {

      var order = this.getView().byId("InpCbaMov");

      if (oEvent.getParameter("cancelled")) {
        MessageToast.show("Scan cancelled", { duration:1000 });
      } else {
        if (oEvent.getParameter("text")) {
          order.setValue( oEvent.getParameter("text") );
          this.onCbaMov();
        } else {
          order.setValue('');
        }
      }
    },

    onScanErrorMov: function (oEvent) {
      MessageToast.show("Scan failed: " + oEvent, { duration:1000 });
    },

    onScanLiveupdateMov: function (oEvent) {
      //     // User can implement the validation about inputting value
    }

  });

});