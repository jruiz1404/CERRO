sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageBox, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("cerro.dsi.controller.CbaSalList", {
        onInit: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("CbaSalList").attachPatternMatched(this._handleRouteMatched, this);

        },

        _handleRouteMatched: function (oEvent) {

            var oTitle = this.getView().byId("idTitleOrden");

            let oArguments = oEvent.getParameter("arguments");
            let data = oArguments.data;

            oTitle.setText("Orden: " + data);
            
			var aFilters = [];

            aFilters.push(new Filter("Orden",
                sap.ui.model.FilterOperator.EQ,
                data));
            
            // update list binding
			var comFil = new sap.ui.model.Filter(aFilters, true);
			var table = this.getView().byId("idTableSal");
			var binding = table.getBinding("rows");
			binding.filter(comFil, "Application");

        }

        
    });

});