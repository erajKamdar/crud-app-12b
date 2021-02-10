import React, { FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Grid, Button } from "@material-ui/core";
import Styles from './add.module.css';


type initialValueTye = {
  name: string;
  number: string;
};

const initialValue: initialValueTye = {
  name: "",
  number: "",
};

type Props = {
  setAddContact: React.Dispatch<React.SetStateAction<boolean>>;
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required")
  .min(3, "name must have atleast 3 characters"),
  number: Yup.string().required("Number is required")
  .matches(/[0-9]/, "Number only contain digits")
  .max(11, "number should contain 11 digits or less than 11 digits")
});

const AddContact: FC<Props> = ({ setAddContact }) => {
  return (
    <div className={Styles.Form}>
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={(values: initialValueTye, onSubmitProps: any) => {
          fetch(`/.netlify/functions/create`, {
            method: "post",
            body: JSON.stringify({ name: values.name, number: values.number }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Contact created successfully", data);
              setAddContact((val) => !val);
              onSubmitProps.resetForm();
            })
            .catch((e) => {
              console.log("Failed to create this contact");
              console.log("Error : ", e);
            });
        }}
      >
        <Grid
          container
          spacing={3}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Form className={Styles.TextInput}>
            <div className={Styles.input_div}>
            <Grid item md={4} sm={5} xs={5}>
              <Field
                as={TextField}
                name="name"
                variant="outlined"
                label="Name"
                helperText={ <ErrorMessage name="name" />}
                fullWidth
              />
            </Grid>
            <Grid item md={4} sm={5} xs={5}>
              <Field
              style={{marginLeft: "15px"}}
                as={TextField}
                name="number"
                variant="outlined"
                label="Number"
                helperText={
                  <ErrorMessage name="number"/>
                }
                fullWidth
              />
            </Grid>
            </div>
            <div className={Styles.btn_div}>
            <Grid item md={10} sm={10} xs={10}>
              <Button variant="contained"
               style={{backgroundColor: 'plum',
                letterSpacing: "2px", padding: "15px 40px"}}
               color="default" type="submit" >
                ADD CONTACT
              </Button>
            </Grid>
            </div>
          </Form>
        </Grid>
      </Formik>
    </div>
  );
};

export default AddContact;