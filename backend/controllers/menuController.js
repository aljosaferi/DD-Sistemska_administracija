var MenuModel = require('../models/menuModel.js');

/**
 * menuController.js
 *
 * @description :: Server-side logic for managing menus.
 */
module.exports = {

    /**
     * menuController.list()
     */
    list: function (req, res) {
        MenuModel.find()
        .populate('tag')
        .then(menus => {
            return res.json(menus);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when getting menu.',
                error: err
            });
        });
    },

    /**
     * menuController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        MenuModel.findOne({_id: id})
        .populate('tag')
        .then(menu => {
            if (!menu) {
                return res.status(404).json({
                    message: 'No such menu'
                });
            }

            return res.json(menu);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when getting menu.',
                error: err
            });
        });
    },

    /**
     * menuController.create()
     */
    create: function (req, res) {
        var menu = new MenuModel({
			dish : req.body.dish,
			sideDishes : req.body.sideDishes,
            restaurant : req.body.restaurantId,
			tag : req.body.tag
        });

        menu.save()
        .then(menu => {
            return res.status(201).json(menu);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when creating menu',
                error: err
            });
        });
    },

    /**
     * menuController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        MenuModel.findOne({_id: id})
        .then(menu => {
            if (!menu) {
                return res.status(404).json({
                    message: 'No such menu'
                });
            }

            menu.dish = req.body.dish ? req.body.dish : menu.dish;
			menu.sideDishes = req.body.sideDishes ? req.body.sideDishes : menu.sideDishes;
			menu.tag = req.body.tag ? req.body.tag : menu.tag;
			
            menu.save()
            .then(menu => {
                return res.json(menu);
            })
            .catch(err => {
                return res.status(500).json({
                    message: 'Error when updating menu.',
                    error: err
                });
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when getting menu',
                error: err
            });
        });
    },

    /**
     * menuController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        MenuModel.findOneAndDelete({ _id: id })
        .then(menu => {
            if (!menu) {
                return res.status(404).json({
                    message: 'No such menu'
                });
            }

            return res.status(204).json();
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when deleting the menu.',
                error: err
            });
        });
    }
};
