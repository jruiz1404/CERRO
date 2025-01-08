/* global QUnit */
// https://api.qunitjs.com/config/autostart/
QUnit.config.autostart = false;

sap.ui.require([
	"cerro/dsi/test/unit/AllTests"
], function (Controller) {
	"use strict";
	QUnit.start();
});