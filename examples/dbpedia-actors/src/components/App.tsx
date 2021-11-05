import React from "react";
import { Actors } from "./Actors";

import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";

export const App = () => (
  <>
    <CssBaseline />
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" noWrap>
          DBpedia Actors example app
        </Typography>

        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" href="https://github.com/karelklima/ldkit">
          LDKit
        </Button>
      </Toolbar>
    </AppBar>
    <Actors />
  </>
);
