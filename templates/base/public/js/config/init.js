// Use this file to do all of your initial setup - this will be run after
// core/core.js and all of your models.

/*
 *  to set up realtime for your specific models
 *  pass an array of model names into the method
 *  below:                                         */

// nails.io.addListenersForModels();

/*
 *  example:
 *
 *  nails.io.addListenersForModels(['Item']);
 *
 *  nails.model.Item.on('save', function (item) {
 *    console.log(item);
 *  });
 *
 *  nails.model.Item.on('update', function (item) {
 *    console.log(item);
 *  });
 *
 *  nails.model.Item.on('remove', function (id) {
 *    console.log(id);
 *  });
 *
 */
