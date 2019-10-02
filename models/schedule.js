'use strict';
module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {});
  Schedule.associate = function(models) {
    // associations can be defined here
  };
  return Schedule;
};