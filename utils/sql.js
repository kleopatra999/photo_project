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
        if (values[i].value) {
            var value = module.exports.wrapQuotesOrNull(values[i].value);
            valueClauses += '`' + values[i].name + '` = ' + value + ', ';
        }
    }

    valueClauses = valueClauses.slice(0, valueClauses.length - 2);

    if (valueClauses === '') {
        return null;
    }
    else {
        return valueClauses;
    }
};
