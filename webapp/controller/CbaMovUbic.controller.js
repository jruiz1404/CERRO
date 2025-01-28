sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("cerro.dsi.controller.CbaMovUbic", {
        onInit: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("CbaMovUbic").attachPatternMatched(this._handleRouteMatched, this);

        },
        
        _handleRouteMatched: function (oEvent) {

            let oArguments = oEvent.getParameter("arguments");
            let data = oArguments.data;

            let oPallet = this.getView().byId("CbaMovUbiText01");
            oPallet.setText( data );

            let ubicacion = this.getView().byId("cbaMovUbic");
            ubicacion.setValue("");

        },

        onNavBack: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("CbaMovimiento");
        },

        OnAcceptEnt: function() {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        //     let definida = this.getView().byId("CbaEntVerif02");
             let ubicacion = this.getView().byId("cbaMovUbic");
            
             if ( ubicacion.getValue() == ""){
                 MessageBox.error("Debe ingresar ubicación para continuar");
                 ubicacion.setRequired(true);
             } else {
                 ubicacion.setValueState("None");



                 let pallet = this.getView().byId("CbaMovUbiText01").getText();
                 let data = pallet.concat(",", ubicacion.getValue() );
   
                 oRouter.navTo("CbaMovDest", { data: data });
       

            }

        },

    // Scan Codigo de barras
    onScanSuccess: function(oEvent) {

        var ubic = this.getView().byId("cbaMovUbic");

        if (oEvent.getParameter("cancelled")) {
            MessageToast.show("Scan cancelled", { duration:1000 });
        } else {
            if (oEvent.getParameter("text")) {
                ubic.setValue( oEvent.getParameter("text") );
                this.OnAcceptEnt();
            } else {
                ubic.setValue('');
            }

        }
    },

    onScanError: function(oEvent) {
        MessageToast.show("Scan failed: " + oEvent, { duration:1000 });
    },

    onScanLiveupdate: function(oEvent) {
        // User can implement the validation about inputting value
    }



    });
});