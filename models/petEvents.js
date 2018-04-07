module.exports = function(sequelize, Sequelize) {
 
    var Event = sequelize.define('Event', {
 
        // id: {
        //     autoIncrement: true,
        //     primaryKey: true,
        //     type: Sequelize.INTEGER
        // },
 
        date: {
            type: Sequelize.DATE,
            notEmpty: true
        },
 
        location: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        description: {
            type: Sequelize.TEXT
        },
 
        RSVP: {
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