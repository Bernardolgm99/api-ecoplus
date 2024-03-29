const bcrypt = require("bcryptjs"); //password encryption

module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define("user",
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: { msg: `Please provide username!` }
                }
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'user'
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: `Please provide a name!` },
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: `Please provide an email!` },
                    isEmail: { msg: `Must be a valid email address!` }
                },
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: `Please provide a password!` },
                }
            },
            genreDesc: {
                type: DataTypes.STRING,
                validate: {
                    isIn: [['M', 'F', 'OTHER']]
                }
            },
            birthDate: {
                allowNull: false,
                type: DataTypes.DATE,
                validate: {
                    notEmpty: { msg: `Please provide a Birth Date!` },
                },
                isDate: { msg: `Invalid Birth Date!` }
            },
            contact: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    notEmpty: false
                },
                isNumeric: { msg: `Please provide a Phone Number!` }
            },
            schoolDesc: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: `Please provide a School name!` }
                },
            },
            image: {
                type: DataTypes.BLOB('medium')
            },
            icone: {
                type: DataTypes.BLOB('medium'),
                allowNull: true
            },
            //If block is 0 - the user is allowed to interact with the platform
            //If block is 1 - the user is not allowed to interact with the platform
            block: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        });
        user.prototype.verifyPassword = function (password, hash) {
            return bcrypt.compareSync(password, hash);
        }
    return user
}
