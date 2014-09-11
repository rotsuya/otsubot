# Otsubot

#### the timecard bot for Hubot and slack

## Description:

タイムカード（勤務表）コマンドです。勤務開始/終了時刻の記録と勤務表の表示ができます。

## Commands:

* `hi [-u <user>] [[<date>] <from time>[-<to time>]]` - 勤務開始時刻を記録します。
* `bye [-u <user>] [[<date>] [<from time>-]<to time>]` - 勤務終了時刻を記録します。
* `list [-u <user>] [<month>]` - 勤務表を表示します。

### Formatting

* `<date>` is YYYY/MM/DD, YYYYMMDD, YY/MM/DD, YYMMDD, MM/DD, M/D or MDD
* `<time>` is HH:MM, HHMM, H:MM, HMM, HH or H
* `<month>` is YYYY/MM, YYYYMM, YY/MM, YYMM, MM or M

## Examples:

### Basics

* `hi` - 今、会社に着いた。
* `bye` - 今、会社を出る。
* `list` - 今月の勤務表を見たい。

### Adbanced

* `hi 9` - 今朝は9:00に出社した。
* `bye 1730` - 今日は17:30に退社した。
* `hi 12/24 9-1730` - 12月24日は9:00~17:30まで勤務した。
* `bye 12/24 9-1730` - 同上
* `bye -u rotsuya` - rotsuyaが会社を出たので代わりに記録してあげる。
* `list 201412` - 2014年12月の勤務表を見たい。
* `list -u rotsuya 201412` - rotsuyaの2014年12月の勤務表を見たい。

## Future Work

* listの削除機能
* 年休対応
* 多言語対応