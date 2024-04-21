const Pagination = require('../lib/pagination');
const { Products, Sequelize } = require('../models');
const Response = require('../lib/response');
const { Op } = require("sequelize");
module.exports = {
  get: async (req, res) => {
    try {
      const { limit = 10, page = 1, search } = req.query;
      const offset = (page - 1) * limit;
      const whereClause = {
        [Op.and]: [
          {
            [Op.or]: [
              {
                name: {
                  [Op.iLike]: `%${search}%`
                }
              },
            ]
          }
        ]
      };
      const response = await Products.findAndCountAll({
        where: (search ? whereClause : {}),
        limit: parseInt(limit),
        offset: offset,
        distinct: true,
      });
      const results = Pagination(limit, page, response)
      res.json(Response.success(results))
    } catch (error) {
      throw (error)
    }
  },
  post: async (req, res) => {
    try {
      const data = req.body;
      const filterName = await Products.findOne({
        where: {
          name: {
            [Op.iLike]: data.name
          }
        }
      })
      if (filterName) {
        return res.json(Response.error('Produk telah terdaftar'))
      }
      const response = Products.create(data);
      if (!response) {
        return res.status(400).json(Response.error('bad request'))
      }
      return res.json(Response.success(response))
    } catch (error) {
      throw (error)
    }
  },
}