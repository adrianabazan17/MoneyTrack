const Categoria = require('../models/categoria.model');

class CategoriaController {

    static async listar(req, res) {

        try {

            const categorias = await Categoria.obtenerTodas();

            res.json({
                success: true,
                data: categorias
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: 'Error al obtener las categorías.'
            });

        }

    }

}

module.exports = CategoriaController;