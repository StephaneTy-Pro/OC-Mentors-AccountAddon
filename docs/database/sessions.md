#Sessions

## Liste des Sessions depuis une date

ici la date du 01/08/2020

```js
d_dbase.get(d_Session.tbl_name).filter(v => d_dayjs(v.when).isSameOrAfter(d_dayjs('20200801'),'day')).value();
```
