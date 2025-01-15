sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
], (Controller, MessageBox, Filter, FilterOperator, Fragment) => {
    "use strict";

    var orden, posicion;

    return Controller.extend("cerro.dsi.controller.CbaSalCarga", {
        onInit: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("CbaSalCarga").attachPatternMatched(this._handleRouteMatched, this);

        },

        _handleRouteMatched: function (oEvent) {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            let oArguments = oEvent.getParameter("arguments");
            let data = oArguments.data;

            let result = data.split(",");

            orden = result[0];
            posicion = result[1];

            var oForm = this.getView().byId("SimpleFormDisplaySal");
            oForm.setTitle("Orden:" + result[0] + " - Posición:" + result[1]);

            this._getResultado(result[0], result[1]);

        },


        _getResultado: function (oOrden, oPos) {

            var oMaterial = this.getView().byId("CbaSalCargaText01"),
                oCantidad = this.getView().byId("CbaSalCargaText02"),
                oIngresado = this.getView().byId("CbaSalCargaText03"),
                oFaltante = this.getView().byId("CbaSalCargaText04");

            // Cargo 
            var oKey = this.getView().getModel().createKey("SalidasPosSet",
                {
                    Orden: oOrden,
                    Posicion: oPos
                });

            this.getView().getModel().read("/" + oKey, {
                success: jQuery.proxy(function (oData, oResponse) {

                    if (oData.Resultado == 'E') {

                        MessageBox.error(oData.Mensaje,
                            {
                                title: "Error Posición",
                                onClose: function (sButton) {
                                    oRouter.navTo("CbaSalList", { data: oOrden });
                                }
                            })

                    }
                    else {

                        oMaterial.setText(oData.Material + ' - ' + oData.Descripcion);
                        oCantidad.setText(oData.CantidadPallet);
                        oIngresado.setText(oData.Ingresado);
                        oFaltante.setText(oData.Faltante);

                    }

                }, this),

                error: jQuery.proxy(function (oError) {



                }, this),

            });

        },



        // Scan Codigo de barras
        onScanSuccess: function (oEvent) {

            var salida = this.getView().byId("cbaSalCarga");

            if (oEvent.getParameter("cancelled")) {
                MessageToast.show("Scan cancelled", { duration: 1000 });
            } else {
                if (oEvent.getParameter("text")) {
                    salida.setValue(oEvent.getParameter("text"));
                    this.OnIngSal();
                } else {
                    salida.setValue('');
                }

            }
        },

        onScanError: function (oEvent) {
            MessageToast.show("Scan failed: " + oEvent, { duration: 1000 });
        },

        onScanLiveupdate: function (oEvent) {
            // User can implement the validation about inputting value
        },

        OnChangePos: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("CbaSalList", { data: orden });

        },

        OnIngSal: function () {

            var that = this;
            var oPallet = this.getView().byId("cbaSalCarga");
            var oModel = this.getView().getModel();

            this.getView().setBusy(true);

            oModel.create("/SalidasIngSet", {
                Orden: orden,
                Posicion: posicion,
                Pallet: oPallet.getValue(),
                Resultado: "",
                Mensaje: ""
            }, {
                success: function (oData) {

                    that.getView().setBusy(false);

                    if (oData.Resultado === "E") {
                        MessageBox.error(oData.Mensaje);
                        oPallet.setValueState("Error");
                    } else {
                        oPallet.setValueState("None");
                        that._getResultado(orden, posicion);
                        oPallet.setValue("");
                    }
                },
                error: function (oError) {
                    this.getView().setBusy(false);
                }
            });


        },

        OnControl: function () {

            var oView = this.getView(),
                oModel = this.getView().getModel();

            var oFilter = new Filter(
                "Orden",
                FilterOperator.EQ,
                orden
            );

            oModel.read("/SalidasControlSet", {
                filters: [oFilter],
                success: function (oData) {

                    if (!this.oDialogControl) {
                        this.oDialogControl = sap.ui.xmlfragment("idControlDialog", "cerro.dsi.fragment.CbaSalControl", this);
                        oView.addDependent(this.oDialogControl);
                    }
                    this.oDialogControl.open();

                    var bConfirm = sap.ui.core.Fragment.byId("idControlDialog", "idBtnConfirmar");
                    var tControlTable = sap.ui.core.Fragment.byId("idControlDialog", "idTableListControl");
                    tControlTable.getBinding("items").filter([new Filter(
                        "Orden",
                        FilterOperator.EQ,
                        orden
                    )]);

                    if (oData.results[0].Resultado === "E") {
                        bConfirm.setVisible(false);
                    } else {
                        bConfirm.setVisible(true);
                    }

                }.bind(this),
                error: function (oData, Response) {
                    MessageBox.error(Response);
                }.bind(this),
            });

        },

        onCtrlCerrar: function () {
            this.oDialogControl.close();
        },

        OnPicking: function(){

            var oView = this.getView();

            if (!this.oDialogPicking) {
                this.oDialogPicking = sap.ui.xmlfragment("idPickingDialog", "cerro.dsi.fragment.CbaSalPicking", this);
                oView.addDependent(this.oDialogPicking);
            }
            this.oDialogPicking.open();

            var TablePicking = sap.ui.core.Fragment.byId("idPickingDialog", "idTableListPicking");
            // TablePicking.getBinding("items").filter([new Filter(
            //     "Orden",
            //     FilterOperator.EQ,
            //     orden
            // )]);            
            TablePicking.getBinding("rows").filter([new Filter(
                "Orden",
                FilterOperator.EQ,
                orden
            )]);   


        },

        onPickSelect: function(oEvent){

            var oSelect;

        },

        onPickCerrar: function(){
            this.oDialogPicking.close();
        }

    });
});