
var bvnVerification= require('../services/'); 

function Bvn(RaveBase){


	this.verification = function (data) {

		return bvnVerification(data, RaveBase)
		 
	}



}
module.exports = Bvn;