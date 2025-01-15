sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageBox, Filter, FilterOperator) => {
    "use strict";

    var Orden;

    return Controller.extend("cerro.dsi.controller.CbaSalList", {
        onInit: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("CbaSalList").attachPatternMatched(this._handleRouteMatched, this);

        },

        // Navegacion Paginas        
        onNavBack: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("CbaSalida");
        },

        _handleRouteMatched: function (oEvent) {

            var oTitle = this.getView().byId("idTitleOrden");

            let oArguments = oEvent.getParameter("arguments");
            let data = oArguments.data;

            Orden = data;

            oTitle.setText("Orden: " + data);

            var aFilters = [];

            aFilters.push(new Filter("Orden",
                sap.ui.model.FilterOperator.EQ,
                data));

            // update list binding
            var comFil = new sap.ui.model.Filter(aFilters, true);
            var table = this.getView().byId("idTableSal");
            var binding = table.getBinding("items");
            binding.filter(comFil, "Application");

        },

        onPressItem: function (oEvent) {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            var oSelected = oEvent.getSource().getSelectedItem();
            var oPos = oSelected.getCells()[0].getText()

            let data = Orden.concat(",", oPos);

            oRouter.navTo("CbaSalCarga", { data: data });

        }

    });

});