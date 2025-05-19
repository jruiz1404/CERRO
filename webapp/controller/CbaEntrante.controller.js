sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
], (Controller, MessageBox, MessageToast) => {
  "use strict";

  var prefixId;
  var oScanResultText;
  var inicial;

  return Controller.extend("cerro.dsi.controller.CbaEntrante", {

    onInit: function () {
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this._oRouter.attachRouteMatched(this.handleRouteMatched, this);
    },



    handleRouteMatched: function (evt) {

      // Limpio cada vez que ingreso el valor de orden 
      var that = this,
        order = this.getView().byId("InpCbaEnt");
      order.setValue('');

      const oInput = this.byId("InpCbaEnt");

      if (oInput) {
        oInput.setValue(""); // limpiar campo

        // Aplicar focus inicial
        setTimeout(() => {
          const $input = oInput.$().find("input");
          if ($input.length) {
            $input[0].focus();
          }
        }, 300);

        // Iniciar intervalo para mantener el foco si el campo está vacío
        this._focusInterval = setInterval(() => {
          const $input = oInput.$().find("input");
          if (oInput.getValue() === "" && document.activeElement !== $input[0]) {
            $input[0].focus();
          }
        }, 500);

        // Escuchar cuando el usuario escriba, para dejar de forzar foco
        oInput.attachLiveChange(() => {
          if (oInput.getValue()) {
            clearInterval(this._focusInterval);
          }
        });
      }

      // if ( inicial == 0 && evt.getParameter("name") === "CbaEntrante" ){

      //   inicial = 1;
      //   sap.ndc.BarcodeScanner.scan(
      //     function (oResult) {
      //       that.onScanSuccess(oResult); //función al escanear
      //     },
      //     function (oError) {
      //       that.onScanError(oError); //función de error
      //     },
      //     function (oLiveUpdate) {
      //       that.onScanLiveupdate(oLiveUpdate); //live updates
      //     }
      //   );

      // } else {
      //   inicial = 0;
      // }

    },


    onExit: function () {
      // Limpiar el intervalo si se sale de la vista
      if (this._focusInterval) {
        clearInterval(this._focusInterval);
      }
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

              //let orden = oData.Orden;
              let orden = this.getView().byId("InpCbaEnt").getValue();
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

      if (oEvent.cancelled) {
        MessageToast.show("Captura Codigo Barras Cancelada", { duration: 1000 });
      } else {
        if (oEvent.text) {
          order.setValue(oEvent.text);
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