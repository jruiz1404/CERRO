sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("cerro.dsi.controller.CbaEntVerif", {
        onInit: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("CbaEntVerif").attachPatternMatched(this._handleRouteMatched, this);

        },

        _handleRouteMatched: function (oEvent) {

            let oArguments = oEvent.getParameter("arguments");
            let data = oArguments.data;

            let result = data.split(",");

            let oPallet = this.getView().byId("CbaEntVerText01");
            oPallet.setText(result[0]);

            let oUbica = this.getView().byId("CbaEntVerif02");
            oUbica.setText(result[1]);

            let ubicacion = this.getView().byId("cbaEntInput");
            ubicacion.setValue("");
            ubicacion.setValueState("None");

        },

        OnCancelEnt: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this),
                oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            MessageBox.confirm(oResourceBundle.getText("PregConfirCancela"),
                {
                    title: oResourceBundle.getText(oResourceBundle.getText("ConfirCancela")),
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oRouter.navTo("Cordoba");
                        }
                    }
                }
            );

        },

        OnAcceptEnt: function () {

            var that = this,
                oModel = this.getView().getModel(),
                oRouter = sap.ui.core.UIComponent.getRouterFor(this),
                oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            let definida = this.getView().byId("CbaEntVerif02");
            let ubicacion = this.getView().byId("cbaEntInput");

            let valor = ubicacion.getValue().toUpperCase();

            if (valor == "") {
                MessageBox.error(oResourceBundle.getText("ErrorIngreso"));
                ubicacion.setRequired(true);
            } else if (valor != definida.getText()) {
                MessageBox.error(oResourceBundle.getText("ErrorUbicacion"));
                ubicacion.setValueState("Error");
            } else {
                ubicacion.setValueState("None");
                this.getView().setBusy(true);

                oModel.create("/PalletSet", {
                    Orden: this.getView().byId("CbaEntVerText01").getText(),
                    Ubicacion: valor,
                    Result: "",
                    Message: ""
                }, {
                    success: function (oData) {

                        this.getView().setBusy(false);

                        if (oData.Result === "S") {
                            MessageBox.success( oData.Message,
                                {
                                    title: oResourceBundle.getText("EjecOk"),
                                    onClose: function (sButton) {
                                        oRouter.navTo("Cordoba");
                                    }
                                });

                        } else {
                            MessageBox.error(oData.Message)
                            ubicacion.setValueState("Error");
                        }


                    }.bind(this),

                    error: function (oError) {

                        this.getView().setBusy(false);

                    }.bind(this)
                });

            }

        },

        // Scan Codigo de barras
        onScanSuccess: function (oEvent) {

            var ubic = this.getView().byId("cbaEntInput");

            if (oEvent.getParameter("cancelled")) {
                MessageToast.show("Scan cancelled", { duration: 1000 });
            } else {
                if (oEvent.getParameter("text")) {
                    ubic.setValue(oEvent.getParameter("text"));
                    this.OnAcceptEnt();
                } else {
                    ubic.setValue('');
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