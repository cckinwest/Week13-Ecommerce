const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });
    if (!tagData) {
      res.status(404).json("No product data is found!");
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Product data
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  try {
    const tagData = await Tag.findAll(req.params.id, {
      include: [{ model: Product }],
    });
    if (!tagData) {
      res
        .status(404)
        .json(`No product data is found for id = ${req.params.id}!`);
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Product data
});

router.post("/", async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create(req.body.tag_name);

    if (req.body.productIds && req.body.productIds.length) {
      const newProductTags = req.body.productIds.map((product_id) => {
        return {
          product_id: product_id,
          tag_id: tagData.id,
        };
      });

      await ProductTag.bulkCreate(newProductTags);
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(
      { tag_name: req.body.tag_name },
      { where: { id: req.params.id } }
    );

    if (req.body.productIds && req.body.productIds.length) {
      const productTags = ProductTag.findAll({
        where: { tag_id: req.params.id },
      });
      const productTagIds = productTags.map(({ product_id }) => product_id);

      const newProductTags = req.body.productIds
        .filter((product_id) => !productTagIds.includes(product_id))
        .map((product_id) => {
          return {
            product_id: product_id,
            tag_id: req.params.id,
          };
        });

      const productTagsRemove = productTags
        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
        .map(({ id }) => id);

      await ProductTag.bulkCreate(newProductTags);
      await ProductTag.destroy({ where: { id: productTagsRemove } });
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    if (Tag.findOne({ where: { id: req.params.id } })) {
      await Tag.destroy({ where: { id: req.params.id } });
      await ProductTag.destroy({ where: { tag_id: req.params.id } });
      res.json(200).json(`The tag of id ${req.params.id} is deleted.`);
    } else {
      res.json(200).json(`No tag of id ${req.params.id}`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
