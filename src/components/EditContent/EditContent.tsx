import React, { FC } from "react";
import { Grid, TextField, Modal } from "@material-ui/core";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import Swal from "sweetalert2";
import styles from './EditContent.module.css'

type ContactData = {
  name: string;
  number: string;
  Ref: any;
};

type Props = {
  name: string;
  number: string;
  Ref: any;
  setAddContact: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required")
  .min(3, "name must have atleast 3 characters"),
  number: Yup.number().required("Number is required")
});

const EditContent: FC<Props> = ({
  name,
  number,
  Ref,
  setAddContact,
  open,
  setOpen,
}) => {
  const initialValue: ContactData = {
    name: name,
    number: number,
    Ref: Ref,
  };

  const handleClose = () => {
    setOpen(false);
};
  
  return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={(values, onSubmitProps: any) => {
            fetch(`/.netlify/functions/update`, {
              method: "post",
              body: JSON.stringify({
                name: values.name,
                number: values.number,
                id: Ref["@ref"].id,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Contact created successfully", data);
                setAddContact((val) => !val);
                onSubmitProps.resetForm();
                setOpen(false);
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Contact is updated",
                  showConfirmButton: false,
                  timer: 1500,
                });
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
          >
                <div className={styles.main_div}>
            <Form className={styles.from_div}>
              <Grid item xs={10}>
                <Field
                  defaultValue={name}
                  as={TextField}
                  name="name"
                  variant="outlined"
                  label="Name"
                  helperText={<ErrorMessage name="name" />}
                  fullWidth
                />
              </Grid>
              <Grid item xs={10}>
                <Field
                  defaultValue={number}
                  as={TextField}
                  name="number"
                  variant="outlined"
                  label="Number"
                  helperText={<ErrorMessage name="number" />}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained"
                style={{backgroundColor: "plum", padding: "15px"}}
                color="default" type="submit">
                        UPDATE CONTACT
                </Button>
              </Grid>
            </Form>
            </div>
          </Grid>
        </Formik>
      </Modal>
  );
};

export default EditContent;