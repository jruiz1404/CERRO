sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
], (Controller, MessageBox, MessageToast) => {
  "use strict";

  var prefixId;
  var oScanResultText;

  return Controller.extend("cerro.dsi.controller.CbaEntrante", {
    
    onInit: function () {
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this._oRouter.attachRouteMatched(this.handleRouteMatched, this);
    },

    handleRouteMatched : function (evt) {
      // Limpio cada vez que ingreso el valor de orden 
      var order = this.getView().byId("InpCbaEnt");
      order.setValue('');

    },

    // Navegacion Paginas        
    onNavBack: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("Cordoba");
    },


    //  Funcionalidades
    onCbaEntCont: function () {

      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      var order = this.getView().byId("InpCbaEnt").getValue();
      var data;

      if (order != "") {

        this.getView().setBusy(true);

        var oKey = this.getView().getModel().createKey("PalletSet",
          {
            Orden: order
          });

        this.getView().getModel().read("/" + oKey, {
          success: jQuery.proxy(function (oData, oResponse) {

            this.getView().setBusy(false);

            if (oData.Result == 'E') {
              MessageBox.error(oData.Message);
            }
            else {

              let orden = oData.Orden;
              let data = orden.concat(",", oData.Ubicacion);

              oRouter.navTo("CbaEntVerif", { data: data });

            }



          }, this),

          error: jQuery.proxy(function (oError) {

            this.getView().setBusy(false);

          }, this),

        });

      }

    },

    // Scan Codigo de barras
    onScanSuccess: function (oEvent) {

      var order = this.getView().byId("InpCbaEnt");

      if (oEvent.getParameter("cancelled")) {
        MessageToast.show("Scan cancelled", { duration: 1000 });
      } else {
        if (oEvent.getParameter("text")) {
          order.setValue(oEvent.getParameter("text"));
          this.onCbaEntCont();
        } else {
          order.setValue('');
        }

      }
    },

    onScanError: function (oEvent) {
      MessageToast.show("Scan failed: " + oEvent, { duration: 1000 });
    },

    onScanLiveupdate: function (oEvent) {
      // User can implement the validation about inputting value
    }

  });
});