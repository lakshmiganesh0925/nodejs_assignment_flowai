const {Sequelize ,DataTypes} = require('sequelize');

const sequelize = new Sequelize({
    dialect:'sqlite',
    storage:'database.sqlite'
});

const Transaction =  sequelize.define('Transaction' , {
    type:{
        type:DataTypes.ENUM('income','expense'),
        allowNull:false
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    amount:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
    }
},{
    freezeTableName:true,
    timestamps:false
});

const Category = sequelize.define('Category',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    type:{
        type:DataTypes.ENUM('income','expense'),
        allowNull:false
    }
},{
    freezeTableName:true,
    timestamps:false
});

sequelize.sync();

module.exports = {Sequelize, Transaction, Category}