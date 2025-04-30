import * as yup from "yup";

const add_new_related_organization_schema = yup.object({
  code: yup.string().required("Organization Type Code is a required field"),
  relationship: yup
    .string()
    .required("Organization Type Name is a required field"),
});

export { add_new_related_organization_schema };
