const ntsuspend = require('ntsuspend');

exports.pause = function(pid) {
	if (!pid) return false;
	return ntsuspend.suspend(pid);
};
exports.resume = function(pid) {
	if (!pid) return false;
	return ntsuspend.resume(pid);
};
