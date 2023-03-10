import React, { FormEvent, useEffect, useRef } from "react";

import { DEFAULT_BOARD_IRI } from "./store";
import { Button, Grid, TextField } from "@mui/material";
import { useSearchParams } from "react-router-dom";

type Inputs = {
  iri: string;
};

export const Form: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (!searchParams.get("iri")) {
      setSearchParams({ iri: DEFAULT_BOARD_IRI });
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = (event: FormEvent) => {
    setSearchParams({ iri: inputRef.current?.value || "" });
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container maxWidth={800} margin="20px auto" spacing={2}>
        <Grid item xs={10}>
          <TextField
            label="Úřední deska"
            placeholder="Zadejte URL úřední desky"
            defaultValue={searchParams.get("iri")}
            fullWidth
            inputRef={inputRef}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            type="submit"
            fullWidth
            color="primary"
            variant="contained"
            size="large"
          >
            ZOBRAZIT
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
