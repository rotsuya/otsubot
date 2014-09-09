// Description:
//   <description of the scripts functionality>
//
// Dependencies:
//   "<module name>": "<module version>"
//
// Configuration:
//   LIST_OF_ENV_VARS_TO_SET
//
// Commands:
//   bye [[yyyy[/]][[m]m[/][d]d]] [[h]h[:][m]m-][h]h[:][m]m]
//   hubot <trigger> - <what the respond trigger does>
//   <trigger> - <what the hear trigger does>
//
// Notes:
//   <optional notes required for the script>
//
// Author:
//   <github username of the original script author>

module.exports = function (robot) {
    var RESPONSE_TO_HI = ['おはようございます。', 'おはようございます。', 'おはようございます。', 'おはようございます。'
        , 'おはようございます。', 'おはようございます。', 'おはようございます。', 'おはようございます。'
        , 'おはようございます。', 'おは'];

    var RESPONSE_TO_BYE = ['お疲れさま。', 'お疲れさま。', 'お疲れさま。', 'お疲れさま。', 'お疲れさま。'
        , 'お疲れさま。', 'お疲れさま。', 'お疲れさま。', 'お疲れさま。', '乙'];

    robot.hear(/^list$/i, function (msg) {
        try {
            var date;
            var key;
            var value;
            var user = msg.message.user. name;
            for (var i = 1; i <= 30; i++) {
                date = new Date(2014, 8, i);
                key = [user, getStringFromDate(date, '/')];
                value = robot.brain.get(JSON.stringify(key)) || [];
                msg.send(key.join(': ') + ' ' + value.join(' ~ '));
            }
        } catch (e) {
            msg.send(e.message);
        }
    });

    robot.hear(/^(hi|bye) ?(?:([\d/]+) )?(?:([\d:]+)-)?(?:-?([\d:]+))?$/i, function (msg) {
        try {
            var command = msg.match[1];
            var dateString = msg.match[2];
            var startString = msg.match[3];
            var endString = msg.match[4];
            var user = msg.message.user. name;

            var date = getToday();
            var start;
            var end;

            if (dateString !== undefined && startString === undefined && endString === undefined) {
                throw (new Error('第1引数があるのに、第2、第3引数が無いよ。'));
                return;
            }
            if (dateString === undefined && startString === undefined && endString === undefined) {
                if (/hi/.test(command)) {
                    start = getTimeNow();
                } else if (/bye/.test(command)) {
                    end = getTimeNow();
                }
                save(user, date, start, end);
                return;
            }

            function getToday() {
                var date = new Date();
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                return date;
            }

            function getTimeNow() {
                var time = new Date();
                time.setFullYear(1970);
                time.setMonth(0);
                time.setDate(1);
                return time;
            }

            if (dateString !== undefined) {
                date = getDateFromString(dateString);
            }

            if (startString !== undefined) {
                start = getTimeFromString(startString);
            }

            if (endString !== undefined) {
                end = getTimeFromString(endString);
            }

            function getDateFromString(string) {
                var date = getToday();
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDate();

                if (/\//.test(string)) {
                    var ymd = /^(?:(\d{2}|\d{4})\/)?(?:(\d{1,2})\/)(?:(\d{1,2})$)/.exec(string);
                } else {
                    var ymd = /^(\d{2}|\d{4})?(\d{1,2})(\d{2})$/.exec(string);
                }
                if (ymd === null) {
                    throw (new Error('日付がパースできないよ。'));
                    return;
                }

                return (new Date((ymd[1] - 0) || year, (ymd[2] - 1) || month, (ymd[3] - 0) || day));
            }

            function getTimeFromString(string) {
                if (/:/.test(string)) {
                    var hm = /^(\d{1,2}):(\d{1,2})$/.exec(string);
                } else if (string.length === 3 || string.length === 4) {
                    var hm = /^(\d{1,2})(\d{2})$/.exec(string);
                } else {
                    var hm = /^(\d{1,2})$/.exec(string);
                }
                if (hm === null) {
                    throw (new Error('時刻がパースできないよ。'));
                    return;
                }
                var time = new Date(1970, 0, 1, (hm[1] - 0) || 0, (hm[2] - 0) || 0);
                if (time.getTime() < (new Date(1970, 0, 1)) || time.getTime() >= (new Date(1970, 0, 2).getTime())) {
                    throw (new Error('時刻がおかしいよ。'));
                    return;
                }
                return time;
            }

            save(user, date, start, end);

            function save(user, date, start, end) {
                if (/hi/.test(command)) {
                    var response = msg.random(RESPONSE_TO_HI);
                } else if (/bye/.test(command)) {
                    var response = msg.random(RESPONSE_TO_BYE);
                }
                robot.brain.set('foo', {'bar': 1});
                var key = [user, getStringFromDate(date, '/')];
                var value = [getStringFromTime(start, ':'), getStringFromTime(end, ':')];
                msg.send(response);
                msg.send(key);
                msg.send(value);
                robot.brain.set(JSON.stringify(key), value);
                robot.brain.save();
            };
        } catch (e) {
            msg.send(e.message);
        }
    });

    function getStringFromTime(time, separator) {
        var hm = [];
        hm[0] = zeroPadding(time.getHours(), 2);
        hm[1] = zeroPadding(time.getMinutes(), 2);
        return hm.join(separator || '');
    }

    function getStringFromDate(date, separator) {
        var ymd = [];
        ymd[0] = zeroPadding(date.getFullYear(), 4);
        ymd[1] = zeroPadding(date.getMonth() + 1, 2);
        ymd[2] = zeroPadding(date.getDate(), 2);
        return ymd.join(separator || '');
    }

    function zeroPadding(number, length) {
        return (Array(length).join('0') + number).slice(-length);
    }

};
