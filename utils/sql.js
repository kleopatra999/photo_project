exports.wrapQuotesOrNull = function(value) {
    if (value) {
        return "'" + value + "'";
    }
    else {
        return "NULL";
    }
};

exports.createValueList = function(values) {
    if (values === null) {
        return null;
    }
    
    var valueClauses = '';

    for (var i = 0; i < values.length; i++) {
        if (values[i].test) {
            valueClauses += '`' + values[i].name + '` = ' + values[i].value + ',';
        }
    }

    valueClauses = valueClauses.slice(0, valueClauses.length - 1);

    if (valueClauses === '') {
        return null;
    }
    else {
        return valueClauses;
    }
};
