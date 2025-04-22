/* eslint-disable no-undef */
const knexfile = require("../knexfile");
const knex = require("knex")(knexfile.test);

test.skip("Test database connection", async () => {
  try {
    await knex.raw("SELECT 1");
    expect(true).toBe(true);
  } catch {
    throw new Error("Database connection failed");
  }
});

afterAll(() => knex.destroy());