sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
], (Controller, MessageBox, MessageToast) => {
  "use strict";

  return Controller.extend("cerro.dsi.controller.CbaSalida", {
    onInit: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("CbaSalida").attachPatternMatched(this._handleRouteMatched, this);
    },

    _handleRouteMatched: function (oEvent) {

      this.getView().byId("InpCbaSal").setValue("");

    },


    // Navegacion Paginas        
    onNavBack: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("Cordoba");
    },


    // //  Funcionalidades
    onCbaSalida: function () {

      var oModel = this.getView().getModel();
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      var order = this.getView().byId("InpCbaSal").getValue();

      oModel.refresh();

      if (order != "") {

        this.getView().setBusy(true);

        // Valido la orden antes
        var oKey = oModel.createKey("SalidasSet",
          {
            Orden: order
          });

        this.getView().getModel().read("/" + oKey, {
          success: jQuery.proxy(function (oData, oResponse) {

            this.getView().setBusy(false);

            if (oData.Resultado == 'E') {
              MessageBox.error(oData.Mensaje);
              this.getView().byId("InpCbaSal").setValueState("Error");
            } 
            else {

              if (oData.Resultado == 'W') {
                MessageBox.success(oData.Mensaje);
              } else {
                this.getView().byId("InpCbaSal").setValueState("None");
                let data = order;
                oRouter.navTo("CbaSalList", { data: data });
              
              }
            }

          }, this),

          error: jQuery.proxy(function (oError) {

            this.getView().setBusy(false);

          }, this),

        });


      }

    },

    // Scan Codigo de barras
    onScanSuccessMov: function (oEvent) {

      var order = this.getView().byId("InpCbaMov");

      if (oEvent.getParameter("cancelled")) {
        MessageToast.show("Scan cancelled", { duration: 1000 });
      } else {
        if (oEvent.getParameter("text")) {
          order.setValue(oEvent.getParameter("text"));
          this.onCbaSalida();
        } else {
          order.setValue('');
        }
      }
    },

    onScanErrorMov: function (oEvent) {
      MessageToast.show("Scan failed: " + oEvent, { duration: 1000 });
    },

    onScanLiveupdateMov: function (oEvent) {
      //     // User can implement the validation about inputting value
    }

  });

});