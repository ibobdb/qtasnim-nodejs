const Pagination = require('../lib/pagination');
const { Products, Transaction } = require('../models');
const Response = require('../lib/response');
const { Op, Sequelize } = require("sequelize");
module.exports = {
  get: async (req, res) => {
    try {
      const { limit = 10, page = 1, search = '', orderBy = 'qty', orderDirection = 'ASC', startDate, endDate } = req.query;
      const offset = (page - 1) * limit;
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);

      const whereClause = {
        [Op.and]: [
          {
            [Op.or]: [,
              {
                '$product.name$': {
                  [Op.iLike]: `%${search}%`
                }
              },
            ]
          },
        ],
        transaction_date: {
          [Op.between]: [start, end]
        }
      };

      const response = await Transaction.findAndCountAll({
        where: (search || startDate ? whereClause : {}),

        limit: parseInt(limit),
        offset: offset,
        distinct: true,
        include: [
          {
            model: Products,
            as: 'product',
          }
        ],
        order: [
          [orderBy, orderDirection],
        ]
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
      if (data.product_id == 0) {
        return res.status(400).json(Response.error('bad request'))
      }
      const response = Transaction.create(data);
      if (!response) {
        return res.status(400).json(Response.error('bad request'))
      }
      return res.json(Response.success(response))
    } catch (error) {
      throw (error)
    }
  },
  delete: async (req, res) => {
    const id = req.params.id;
    try {
      const response = await Transaction.destroy({
        where: {
          id: id
        }
      })
      return res.json(Response.success(response, 'Data dihapus'))
    } catch (error) {
      throw (error)
    }
  },
  update: async (req, res) => {
    try {
      const data = req.body;
      const id = req.params.id;
      if (data.product_id == 0) {
        return res.status(400).json(Response.error('bad request'))
      }
      const response = await Transaction.update(data, {
        where: {
          id: id
        }
      });
      return res.json(Response.success(response, 'Data di update'))
    } catch (error) {
      throw (error)
    }
  }
}