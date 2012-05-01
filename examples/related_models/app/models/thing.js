var Thing = function () {

  this.defineProperties({
    id: {type: 'string', required: true}
  , widgetid: {type: 'string', required: true}
  });

  this.belongsTo('Box');

  this.adapter = 'Mongo';

};
Thing = geddy.model.register('Thing', Thing);
