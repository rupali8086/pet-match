module.exports = function(sequelize, Sequelize) {
 
    var Event = sequelize.define('Event', {
        name: {
            type: Sequelize.STRING,
            notEmpty: true
        },
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