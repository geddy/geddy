var Box = function () {

  this.defineProperties({
    id: {type: 'string', required: true}
  });

  this.hasMany('Things');

  this.adapter = 'mongo';

};
Box = nails.model.register('Box', Box);
