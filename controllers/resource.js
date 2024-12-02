const fs = require("fs");
const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");
const { Op } = require("sequelize");
const User = require("../models/user");
const MyList = require("../models/mylist");
const Resource = require("../models/resource");
const sequelize = require("../util/database");

dotenv.config();

exports.uploadResource = async (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}-user${req.body.userId}`);
    },
  });

  const upload = multer({ storage }).single("pdf");

  upload(req, res, async function (err) {
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(500).send("File upload failed");
    }

    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const { userId, resourceName, resourceClass, tags } = req.body;

    // Validate request body
    if (!userId || !resourceName || !resourceClass) {
      return res.status(400).send("Missing required fields in request body");
    }

    const resource = {
      userId,
      resourceName,
      resourcePath: req.file.path,
      resourceClass,
      tags,
    };

    try {
      const response = await Resource.create(resource);
      res.status(201).json(response);
    } catch (dbErr) {
      res.status(500).send("Error saving resource to database");
    }
  });
};

exports.getAllResources = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const resources = await Resource.findAll({
      where: {
        userId: {
          [Op.ne]: userId,
        },
      },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const resourcesWithFileURL = resources.map((resource) => {
      const resourceData = resource.toJSON();
      return {
        ...resourceData,
        resourcePath: `http://localhost:3002/${resource.resourcePath}`,
      };
    });

    return res.status(200).send(resourcesWithFileURL);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "An error occurred while fetching resources." });
  }
};

exports.getMyResources = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const resources = await Resource.findAll({
      where: {
        userId: {
          [Op.eq]: userId,
        },
      },
    });

    const resourcesWithFileURL = resources.map((resource) => {
      const resourceData = resource.toJSON();
      return {
        ...resourceData,
        resourcePath: `http://localhost:3002/${resource.resourcePath}`,
      };
    });

    return res.status(200).send(resourcesWithFileURL);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "An error occurred while fetching resources." });
  }
};

exports.deleteResource = async (req, res) => {
  const id = req.params.resourceId;
console.log(id, "..........................")
  await Resource.destroy({
    where: {
      id: id,
    },
  })
    .then((result) =>
      res.send({ message: "Resource deleted successfully!" }).status(200)
    )
    .catch((err) =>
      res.send({ message: "Resource couldn't be deleted!" }).status(404)
    );
};

exports.addToList = async (req, res) => {
  const { userId, resourceId } = req.body;

  const data = {
    userId,
    resourceId,
  };

  try {
    const response = await MyList.create(data);
    return res.status(201).json(response); // Ensure you're returning JSON
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMyList = async (req, res) => {
  const { userId } = req.params;

  try {
    const myListItems = await MyList.findAll({
      where: {
        userId: {
          [Op.eq]: userId,
        },
      },
      include: [
        {
          model: Resource,
          attributes: ["resourceName", "resourceClass", "resourcePath"], // Specify the fields you want from the User model
        },
      ],
    });

    const modifiedData = myListItems.map((item) => {
      const resourceData = item?.toJSON();
      return {
        ...resourceData,
        resource: {
          ...resourceData.resource,
          resourcePath: `http://localhost:3002/${resourceData.resource.resourcePath}`,
        },
      };
    });

    return res.status(200).send(modifiedData);
  } catch (err) {
    return res
      .status(500)
      .send({ message: "An error occurred while fetching resources." });
  }
};

exports.fetchAllCounts = async (req, res) => {
  const { id } = req.params;

  try {
    const myResourceCount = await Resource.count({
      where: {
        userId: id,
      },
    });

    const allResourceCount = await Resource.count();

    const myListCount = await MyList.count({
      whrere: {
        userId: id,
      },
    });

    const allClasses = ["CIT 160", "IS 144"];

    const resourcesByClass = await Resource.findAll({
      where: {
        userId: id,
      },
      attributes: [
        "resourceClass",
        [sequelize.fn("COUNT", sequelize.col("resourceClass")), "count"],
      ],
      group: ["resourceClass"],
    });

    // Map the database results to an object for easy lookup
    const resourcesByClassMap = resourcesByClass.reduce((acc, resource) => {
      acc[resource.getDataValue("resourceClass")] = parseInt(
        resource.getDataValue("count"),
        10
      );
      return acc;
    }, {});

    // Generate the final array with all classes, setting missing ones to zero
    const resourcesByClassCount = allClasses.map((className) => ({
      class: className,
      count: resourcesByClassMap[className] || 0, // Use 0 if the class is missing in the database results
    }));

    return res.status(200).send({
      allResources: allResourceCount,
      myResources: myResourceCount,
      myListResources: myListCount,
      resourcesByClassCount,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ message: "An error occurred while fetching resources count." });
  }
};

exports.deleteFromList = async (req, res) => {};
