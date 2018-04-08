module.exports = function (sequelize, Sequelize) {

    var User = sequelize.define('User', {

        authType: {
            type: Sequelize.ENUM('google', 'twitter', 'facebook'),
            notEmpty: true,
        },

        oauthId: {
            type: Sequelize.STRING,
            notEmpty: true,
        },

        firstName: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        lastName: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        displayName: {
            type: Sequelize.STRING
        },

        bio: {
            type: Sequelize.TEXT
        },

        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            },
            notEmpty: false,
        },

        // password: {
        //     type: Sequelize.STRING,
        //     allowNull: false
        // },

        last_login: {
            type: Sequelize.DATE
        },

        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        }



    });

    User.associate = function (models) {

        User.hasMany(models.Event, {
            onDelete: "cascade"
        });
    };

    return User;

}

