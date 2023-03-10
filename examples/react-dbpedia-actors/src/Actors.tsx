import React, { useEffect, useState } from "react";
import { Container, Grid, MenuItem, TextField } from "@mui/material";

import { favouriteActors, languages } from "./store";
import { Actor } from "./Actor";

export const Actors: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  const [actorIri, setActorIri] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    setActorIri(favouriteActors[0]), setLanguage(languages[0]);
    setInitialized(true);
  }, [setActorIri, setLanguage, setInitialized]);

  if (!initialized) {
    return null;
  }

  const handleActorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActorIri(event.target.value);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <TextField
            select
            fullWidth
            label="Select actor resource"
            value={actorIri}
            onChange={handleActorChange}
          >
            {favouriteActors.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            label="Select preferred language"
            value={language}
            onChange={handleLanguageChange}
          >
            {languages.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Actor actorIri={actorIri} language={language} />
        </Grid>
      </Grid>
    </Container>
  );
};
