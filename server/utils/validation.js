//validation functions for validating user entry
var isRealString = (str)=>{
    return typeof str === 'string' && str.trim().length > 0;
}

module.exports = {isRealString};