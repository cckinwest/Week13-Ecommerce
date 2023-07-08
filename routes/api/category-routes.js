const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  // find all categories
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });
    if (!categoryData) {
      res.status(404).json("No product data is found!");
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Products
});

router.get("/:id", async (req, res) => {
  // find one category by its `id` value
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      // be sure to include its associated Category and Tag data
      include: [{ model: Product }],
    });

    if (categoryData) {
      res.status(200).json(categoryData);
    } else {
      res
        .status(200)
        .json(`No category data is found for id = ${req.params.id}!`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Products
});

router.post("/", async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create(req.body);

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryData = await Category.update(
      { category_name: req.body.category_name },
      {
        where: { id: req.params.id },
      }
    );

    if (categoryData) {
      res.status(200).json(categoryData);
    } else {
      res
        .status(200)
        .json(`No category data is found for id = ${req.params.id}!`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: { id: req.params.id },
    });

    if (categoryData) {
      await Product.update(
        { category_id: 0 },
        { where: { category_id: req.params.id } }
      );

      res.status(200).json(`The category with id ${req.params.id} is deleted.`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
