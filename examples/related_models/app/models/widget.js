var Widget = function () {

  this.defineProperties({
    id: {type: 'string', required: true}
  });

  this.hasOne('Thing');

  this.adapter = 'mongo';

};
Widget = nails.model.register('Widget', Widget);
