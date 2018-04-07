module.exports = function(sequelize, Sequelize) {
 
    var Event = sequelize.define('Event', {
<<<<<<< HEAD
 
        // id: {
        //     autoIncrement: true,
        //     primaryKey: true,
        //     type: Sequelize.INTEGER
        // },
 
=======
        name: {
            type: Sequelize.STRING,
            notEmpty: true
        },

>>>>>>> 5917ad4693bd06e181ad670c553aaf28d330b1eb
        date: {
            type: Sequelize.DATE,
            notEmpty: true
        },
 
        address1: {
            type: Sequelize.STRING,
            notEmpty: true
        },
  
        address2: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        city: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        state: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        zip: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        
        description: {
            type: Sequelize.TEXT
        },
 
        link: {
            type: Sequelize.STRING
        },
 
       
    });

    Event.associate = function(models) {
    Event.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
 
    return Event;
 
}