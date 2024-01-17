
var Refund = require('../services/rave.refund'); 

function Refund(RaveBase){


	this.refund= function (data) {

		return Refund(data, RaveBase)
		 
	}



}
module.exports = Refund;