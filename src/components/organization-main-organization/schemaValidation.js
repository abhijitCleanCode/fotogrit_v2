import * as yup from "yup";

const add_new_organization_schema = yup.object({
  // code: yup.string(),
  name: yup.string().required("Organization Name is a required field"),
  short_name: yup.string(),
  type: yup.string(),
  city: yup.string(),
  location: yup.string(),
  pic: yup.string(),
  description: yup.string(),
  website: yup
    .string()
    .url("Please enter a valid URL")
    .nullable()
    .notRequired(),
  instagram: yup
    .string()
    .url("Please enter a valid URL")
    .nullable()
    .notRequired(),
  facebook: yup
    .string()
    .url("Please enter a valid URL")
    .nullable()
    .notRequired(),
  tiktok: yup.string().url("Please enter a valid URL").nullable().notRequired(),
});

export { add_new_organization_schema };
