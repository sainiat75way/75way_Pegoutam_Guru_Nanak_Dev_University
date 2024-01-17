var listSettlements = require('../services/rave.list.settlements');
var fetchSettlements = require('../services/rave.fetch.settlements');


function settlements(RaveBase) {


    this.list = function (data) {

        return listSettlements(data, RaveBase);

    }
    this.fetch = function (data) {

        return fetchSettlements(data, RaveBase);

    }




}
module.exports = settlements;