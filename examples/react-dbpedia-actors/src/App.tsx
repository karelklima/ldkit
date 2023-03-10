import React from "react";
import { Actors } from "./Actors";

import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Toolbar,
  Typography,
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
