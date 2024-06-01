var TagModel = require('../models/tagModel.js');

/**
 * tagController.js
 *
 * @description :: Server-side logic for managing tags.
 */
module.exports = {

    /**
     * tagController.list()
     */
    list: function (req, res) {
        TagModel.find()
        .then(tags => {
            return res.json(tags);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when getting tag.',
                error: err
            });
        });
    },

    /**
     * tagController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        TagModel.findOne({_id: id})
        .then(tag => {
            if (!tag) {
                return res.status(404).json({
                    message: 'No such tag'
                });
            }

            return res.json(tag);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when getting tag.',
                error: err
            });
        });
    },

    /**
     * tagController.create()
     */
    create: function (req, res) {
        var tag = new TagModel({
			name : req.body.name
        });

        tag.save()
        .then(tag => {
            return res.status(201).json(tag);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when creating tag',
                error: err
            });
        })
    },

    /**
     * tagController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        TagModel.findOne({_id: id})
        .then(tag => {
            if (!tag) {
                return res.status(404).json({
                    message: 'No such tag'
                });
            }

            tag.name = req.body.name ? req.body.name : tag.name;
			
            tag.save()
            .then(tag => {
                return res.json(tag);
            })
            .catch(err => {
                return res.status(500).json({
                    message: 'Error when updating tag.',
                    error: err
                });
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error when getting tag',
                error: err
            });
        });
    },

    /**
     * tagController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        TagModel.findOneAndDelete({ _id: id })
        .then(tag => {
            if(!tag) {
                return res.status(404).json({
                    message: 'No such tag'
                });
            }
            console.log(tag)
            return res.status(204).json();
        })
        .catch(err =>{
            return res.status(500).json({
                message: 'Error when deleting the tag.',
                error: err
            });
        });
    }
};
