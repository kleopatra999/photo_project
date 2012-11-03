exports.wrapQuotesOrNull = function(value) {
    if (value) {
        return "'" + value + "'";
    }
    else {
        return "NULL";
    }
};
