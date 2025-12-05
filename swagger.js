// swagger/swagger.js
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

// Load YAML
const yamlPath = path.join(__dirname, "api.yaml");
const file = fs.readFileSync(yamlPath, "utf8");
const swaggerSpec = yaml.load(file);

module.exports = { swaggerUi, swaggerSpec };