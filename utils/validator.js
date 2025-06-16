const { z } = require("zod");

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  source: z.string().min(1, "Source is required"),
  message: z.string().optional(),
});

function validateLead(input) {
  const result = leadSchema.safeParse(input);
  if (!result.success) {
    throw new Error(
      "Validation error: " + JSON.stringify(result.error.format())
    );
  }
  return result.data;
}

module.exports = {
  validateLead,
};
