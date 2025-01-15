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
                    Posicion: oPos,
                    Pallet: "1"
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

        OnPicking: function () {

            var oView = this.getView();

            if (!this.oDialogPicking) {
                this.oDialogPicking = sap.ui.xmlfragment("idPickingDialog", "cerro.dsi.fragment.CbaSalPicking", this);
                oView.addDependent(this.oDialogPicking);
            }
            this.oDialogPicking.open();

            var TablePicking = sap.ui.core.Fragment.byId("idPickingDialog", "idTableListPicking");
            TablePicking.getBinding("items").filter([new Filter(
                "Orden",
                FilterOperator.EQ,
                orden
            )]);

        },

        onPickSelect: function (oEvent) {

            var that = this;
            var oModel = this.getView().getModel();
            var oTable = oEvent.getSource();
            var oSelectedItem = oEvent.getParameter("listItem");
            var bSelected = oEvent.getParameter("selected");

            var oPallet = oSelectedItem.getCells()[1].getText()
            var oText = "Desea eliminar el pallet " + oPallet;

            if (bSelected == true) {
                MessageBox.confirm(oText, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.CLOSE],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (sAction) {

                        switch (sAction) {
                            case MessageBox.Action.YES:

                                var oKey = oModel.createKey("SalidasIngSet",
                                    {
                                        Orden: orden,
                                        Posicion: posicion,
                                        Pallet: oPallet
                                    });

                                oModel.remove("/" + oKey, {
                                    success: jQuery.proxy(function (oData, oResponse) {
                                        MessageBox.information("Pallet Eliminado");
                                        oTable.removeSelections();

                                        that._getResultado(orden, posicion);

                                    },),
                                    error: jQuery.proxy(function (oError) {

                                    }, this)
                                });

                                break;
                            case MessageBox.Action.CLOSE:
                                oTable.removeSelections()
                                break;
                        }

                    },

                });
            }

        },

        onPickCerrar: function () {
            this.oDialogPicking.close();
        },

        onCtrlfirmSal: function () {

            var oModel = this.getView().getModel();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            this.getView().setBusy(true);

            oModel.create("/SalidasSet", {
                Orden: orden
            }, {
                success: function (oData) {

                    this.getView().setBusy(false);

                    if (oData.Resultado == 'S') {
                        MessageBox.success(oData.Mensaje);
                        this.onCtrlCerrar();
                        oRouter.navTo("Cordoba");
                    } else {
                        MessageBox.error(oData.Mensaje);
                    }

                }.bind(this),

                error: function (oError) {

                    this.getView().setBusy(false);
                    MessageBox.error(oError);

                }.bind(this)
            });

        },

        OnCancelSal: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oText = "Cancela carga de OT " + orden;

            MessageBox.confirm(oText, {
                actions: [MessageBox.Action.YES, MessageBox.Action.CLOSE],
                emphasizedAction: MessageBox.Action.YES,
                onClose: function (sAction) {

                    switch (sAction) {
                        case MessageBox.Action.YES:

                            var oKey = oModel.createKey("SalidasSet",
                                {
                                    Orden: orden
                                });

                            oModel.remove("/" + oKey, {
                                success: jQuery.proxy(function (oData, oResponse) {


                                },),
                                error: jQuery.proxy(function (oError) {

                                }, this)
                            });

                            break;
                        case MessageBox.Action.CLOSE:

                    }

                }

            });
        }

    })
});