module.exports = function(sequelize, Sequelize) {
 
    var Events = sequelize.define('Events', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        date: {
            type: Sequelize.DATE,
            notEmpty: true
        },
        eventName : {
            type: Sequelize.TEXT,
            notEmpty: true
        },
 
        address : {
            type: Sequelize.STRING,
            notEmpty: true
        },
        city : {
            type: Sequelize.STRING,
            notEmpty : true
        },
        state: {
            type : Sequelize.STRING,
            notEmpty : true
        },
        zipcode : {
            type : Sequelize.INTEGER,
            notEmpty : true
        },
        
        description: {
            type: Sequelize.TEXT
        },
 
        link: {
            type: Sequelize.STRING
        }
 
       
    });

    Events.associate = function(models) {
    Events.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
 
    return Events;
 
}