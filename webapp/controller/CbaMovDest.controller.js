sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("cerro.dsi.controller.CbaMovDest", {
        onInit: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("CbaMovDest").attachPatternMatched(this._handleRouteMatched, this);

        },

        _handleRouteMatched: function (oEvent) {

            let oArguments = oEvent.getParameter("arguments");
            let data = oArguments.data;

            let result = data.split(",");

            let oPallet = this.getView().byId("CbaMovDestText01");
            oPallet.setText(result[0]);

            let oUbica = this.getView().byId("CbaMovDest02");
            oUbica.setText(result[1]);

        },


        OnCancelDest: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            MessageBox.confirm("¿Confirma cancelacion de Movimiento?",
                {
                    title: "Confirma Cancelacón",
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oRouter.navTo("CbaMovimiento");
                        }
                    }
                }
            );

        },

        OnAcceptDest: function () {

            var that = this;
            var oModel = this.getView().getModel();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            let pallet = this.getView().byId("CbaMovDestText01");
            let ubicacion = this.getView().byId("CbaMovDest02");
            let destino = this.getView().byId("cbaEntInputDest");

            if (destino.getValue() == "") {
                MessageBox.error("Debe ingresar destino para confirmar");
                ubicacion.setRequired(true);
            } else {
                destino.setValueState("None");

                MessageBox.confirm("Esta a punto de mover 1 Pallet(s). ¿Esta seguro?",
                    {
                        actions: ["Si", "No"],
                        emphasizedAction: "No",
                        onClose: function (sAction) {

                            if (sAction == "Si") {

                                that.getView().setBusy(true);

                                oModel.create("/MovimientoSet", {
                                    Pallet: pallet.getText(),
                                    Origen: ubicacion.getText(),
                                    Destino: destino.getValue(),
                                    Resultado: "",
                                    Mensaje: ""
                                }, {
                                    success: function (oData) {

                                        that.getView().setBusy(false);

                                        if (oData.Resultado == 'S') {
                                            MessageBox.success(oData.Mensaje);
                                            oRouter.navTo("Cordoba");
                                        } else {
                                            MessageBox.error(oData.Mensaje);
                                        }


                                    }.bind(this),

                                    error: function (oError) {

                                        that.getView().setBusy(false);

                                    }.bind(this)
                                });


                            }

                        },


                    });

            }

        },

        // Scan Codigo de barras
        onScanSuccess: function (oEvent) {

            var ubic = this.getView().byId("cbaEntInputDest");

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