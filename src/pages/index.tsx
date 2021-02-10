import React, { useState, useEffect } from "react";
import { Grid, Typography  } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddContact from "../components/Add/add";
import EditContent from "../components/EditContent/EditContent";
import styles from './index.module.css'
import Swal from 'sweetalert2';

type data = {
  name: string;
  number: string;
};

type ContactData = {
  ref: Object;
  ts: number;
  data: data;
};

function App() {
  const [readData, setReadData] = useState<null | ContactData[]>(null);
  const [addContact, setAddContact] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const [updateContact, setUpdateContent] = useState<null | ContactData>(null);

  useEffect(() => {
    fetch(`/.netlify/functions/readContacts`)
      .then((response) => response.json())
      .then((data) => {
        setReadData(data.data);
        console.log(data.data);
      })
      .catch((e) => {
        console.log("Error : ", e);
        console.log("Failed to get Data");
      });
  }, [addContact]);

  function deleteContact(ref: any) {
    fetch(`/.netlify/functions/delete`, {
      method: "post",
      body: JSON.stringify({ id: ref["@ref"].id }),
    })
      .then((response) => {
        response.json();
        console.log("Deleting");
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Contact is deleted',
          showConfirmButton: false,
          timer: 1500
        })
      })
      .then((data) => {
        setAddContact((val) => !val);
        console.log("Deleted : ", data);
      });
  }

  function updateContent(contact: ContactData) {
   setUpdateContent(contact);
    setOpenEditor(true);
  }



  return (
    <div className={styles.App}>
      <h1 className={styles.main} >Contact Diary</h1>
      <AddContact setAddContact={setAddContact} />
      <div className={styles.contain_div}>
        <h1 style={{color: "rgb(170, 10, 170)",
      fontFamily:"monospace", letterSpacing: "2px", marginBottom:"15px"}}>All Contacts</h1>
        {readData === null || readData.length === 0 ? (
          <h3>Right Now You Have No Contact Save...!!!</h3>
        ) : (
          readData.map((contacts: ContactData, ind) => {
            return (
              <div key={ind} className={styles.contactList}>
                <Grid
                  container
                  spacing={3}
                  justify="space-around"
                  alignItems="stretch"
                >
                  <Grid item md={2} sm={3} xs={4}>
                    <Typography variant="h6">{contacts.data.name}</Typography>
                  </Grid>
                  <Grid item md={2} sm={3} xs={5}>
                    <Typography variant="h6">{contacts.data.number}</Typography>
                  </Grid>
                  <Grid item md={2} sm={3} xs={3}>
                    <EditIcon
                      style={{marginRight: "15px", color: "purple"}}
                      className="Icon"
                      onClick={() => updateContent(contacts)}
                    />

                    <DeleteIcon
                    style={{color: "red"}}
                      className="Icon"
                      onClick={() => deleteContact(contacts.ref)}
                    />
                  </Grid>
                </Grid>
              </div>
            );
          })
        )}
      </div>
      {updateContact !== null && (
        <EditContent
          name={updateContact.data.name}
          number={updateContact.data.number}
          Ref={updateContact.ref}
          setAddContact={setAddContact}
          open={openEditor}
          setOpen={setOpenEditor}
        />
      )}
    </div>
  );
}

export default App;