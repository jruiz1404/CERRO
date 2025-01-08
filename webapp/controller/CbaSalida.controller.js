sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
], (Controller, MessageBox, MessageToast) => {
  "use strict";

   return Controller.extend("cerro.dsi.controller.CbaSalida", {
    onInit: function () {

    },


    // Navegacion Paginas        
    onNavBack: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("Cordoba");
    },


    // //  Funcionalidades
    onCbaSalida: function () {

      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      var order = this.getView().byId("InpCbaSal").getValue();

      if (order != "") {

          // Valido la orden antes???
          

          let data = order;
          oRouter.navTo("CbaSalidaList", { data: data });

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
          this.onCbaSalida();
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