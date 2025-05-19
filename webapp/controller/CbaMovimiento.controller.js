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

      const oInput = this.byId("InpCbaMov");

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