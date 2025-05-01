import * as yup from "yup";

const add_new_organization_type_schema = yup.object({
  code: yup
    .string()
    // .required("Organization Type Code is a required field")
    .max(20, "Code must be less than 20 characters"),
  // .matches(/^[A-Z0-9_]+$/, "Code must be uppercase letters, numbers, and underscores"),

  name: yup
    .string()
    .required("Organization Type Name is a required field")
    .max(100, "Name must be less than 100 characters"),

  description: yup
    .string()
    // .required("Description is a required field")
    .max(500, "Description must be less than 500 characters"),
});

const edit_organization_type_schema = yup.object({
  code: yup
    .string()
    // .required("Organization Type Code is a required field")
    .max(20, "Code must be less than 20 characters"),
  // .matches(/^[A-Z0-9_]+$/, "Code must be uppercase letters, numbers, and underscores"),

  name: yup
    .string()
    .required("Organization Type Name is a required field")
    .max(100, "Name must be less than 100 characters"),

  description: yup
    .string()
    // .required("Description is a required field")
    .max(500, "Description must be less than 500 characters"),
});

export { add_new_organization_type_schema, edit_organization_type_schema };
