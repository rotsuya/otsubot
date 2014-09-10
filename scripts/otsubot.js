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
        , 'おはようございます。', '乙。'];

    var RESPONSE_TO_BYE = ['お疲れさま。', 'お疲れさま。', 'お疲れさま。', 'お疲れさま。', 'お疲れさま。'
        , 'お疲れさま。', 'お疲れさま。', 'お疲れさま。', 'お疲れさま。', '乙。'];

    var RESPONSE_TO_LIST = ['どうぞ。', 'どうぞ。', 'どうぞ。', 'どうぞ。', 'どうぞ。'
        , 'どうぞ。', 'どうぞ。', 'どうぞ。', 'どうぞ。', '乙。'];

    var RESPONSE_TO_ERROR = ['なに言ってんの。', 'なに言ってんの。', 'なに言ってんの。', 'なに言ってんの。'
        , 'なに言ってんの。', 'なに言ってんの。', 'なに言ってんの。', 'なに言ってんの。'
        , 'なに言ってんの。', 'なに言ってんの。'];

    robot.hear(/^list(?: (?:(\d{2}|\d{4})\/?)?(\d{1,2}))?$/i, listCommand);

    robot.hear(/^(?:hi|hello|おはようございます) ?(?:([\d/]+) )?(?:([\d:]+)-?)?(?:-([\d:]+))?$/i, hiByeCommand('hi'));

    robot.hear(/^(?:bye|お疲れ様でした|お疲れさまでした) ?(?:([\d/]+) )?(?:([\d:]+)-)?(?:-?([\d:]+))?$/i, hiByeCommand('bye'));

    function listCommand(msg) {
        try {
            var date = getToday();
            if (msg.match[1]) {
                if (msg.match[1].length === 2) {
                    msg.match[1] = '20' + msg.match[1];
                }
                date.setFullYear(msg.match[1] - 0);
            }
            if (msg.match[2]) {
                date.setMonth(msg.match[2] - 1);
            }
            var user = msg.message.user.name;

            var month = date.getMonth();
            msg.send(user + 'の' + (month + 1) + '月の勤務表やね。あったかな？' + msg.random(RESPONSE_TO_LIST));

            setTimeout(function() {
                var key;
                var value;
                var result = '';
                for (var day = 1; day <= 31; day++) {
                    date.setDate(day);
                    if (date.getMonth() !== month) {
                        break;
                    }
                    key = [user, getStringFromDate(date, '/')];
                    value = robot.brain.get(JSON.stringify(key));
                    if (value) {
                        result += getStringFromDate(date, '/') + ', ' + value.join(', ') + '\n';
                    }
                }
                msg.send(result ? 'date, start, end\n' + result : 'やっぱり無いわ。');
            }, 500);
        } catch (e) {
            msg.send(msg.random(RESPONSE_TO_ERROR) + e.message);
        }
    }

    function hiByeCommand(command) {
        return function(msg) {
            try {
                var dateInput = msg.match[1];
                var startInput = msg.match[2];
                var endInput = msg.match[3];
                var user = msg.message.user. name;

                var date = getToday();
                var start;
                var end;

                if (dateInput && !startInput && !endInput) {
                    throw (new Error('第1引数があるのに、第2、第3引数が無いよ。'));
                    return;
                }

                if (!dateInput && !startInput && !endInput) {
                    if (/hi/.test(command)) {
                        start = getTimeNow();
                    } else if (/bye/.test(command)) {
                        end = getTimeNow();
                    }
                } else {
                    if (dateInput) {
                        date = getDateFromString(dateInput);
                    }

                    if (startInput) {
                        start = getTimeFromString(date, startInput);
                    }

                    if (endInput) {
                        end = getTimeFromString(date, endInput);
                    }
                }

                if (date) {
                    var dateOutput = getStringFromDate(date, '/');
                }
                if (start) {
                    var startOutput = getStringFromTime(start, ':');
                }
                if (end) {
                    var endOutput = getStringFromTime(end, ':');
                }

                save(user, dateOutput, startOutput, endOutput);
                respond(command, user, dateOutput, startOutput, endOutput, msg);
            } catch (e) {
                msg.send(msg.random(RESPONSE_TO_ERROR) + e.message);
            }
        };
    }

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

    function save(user, date, start, end) {
        var key = [user, date];
        var value = robot.brain.get(JSON.stringify(key)) || [];
        if (start) {
            value[0] = start;
        }
        if (end) {
            value[1] = end;
        }
        robot.brain.set(JSON.stringify(key), value);
        robot.brain.save();
    }

    function respond(command, user, date, start, end, msg) {
        if (/hi/.test(command)) {
            var response = msg.random(RESPONSE_TO_HI);
        } else if (/bye/.test(command)) {
            var response = msg.random(RESPONSE_TO_BYE);
        }
        response += user + 'の勤務時間は' + date + ' ' + [start, end].join('~') + 'やね。';
        msg.send(response);
    }

    function getTimeFromString(date, string) {
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();

        if (/:/.test(string)) {
            var hm = /^(\d{1,2}):(\d{1,2})$/.exec(string);
        } else if (string.length === 3 || string.length === 4) {
            var hm = /^(\d{1,2})(\d{2})$/.exec(string);
        } else {
            var hm = /^(\d{1,2})$/.exec(string);
        }
        if (!hm) {
            throw (new Error('時刻がパースできないよ。'));
            return;
        }
        var time = new Date(year, month, day, (hm[1] - 0) || 0, (hm[2] - 0) || 0);
        var today = new Date(year, month, day);
        var tomorrow = new Date(year, month, day + 1);
        if (time < today || time >= tomorrow) {
            throw (new Error('時刻がおかしいよ。'));
            return;
        }
        return time;
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
        if (!ymd) {
            throw (new Error('日付がパースできないよ。'));
            return;
        }

        if (ymd[1] && ymd[1].length === 2) {
            ymd[1] = '20' + ymd[1];
        }

        return (new Date((ymd[1] - 0) || year, ymd[2] ? ymd[2] - 1 : month, (ymd[3] - 0) || day));
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
        return time;
    }
};
