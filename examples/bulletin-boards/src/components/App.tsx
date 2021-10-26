import React from "react";
import { Board } from "./Board";

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
          Úřední desky
        </Typography>

        <Box sx={{ flexGrow: 1 }} />
        <Button
          color="inherit"
          href="https://ofn.gov.cz/úřední-desky/2021-07-20/příklady/3.jsonld"
        >
          https://ofn.gov.cz/úřední-desky/2021-07-20/příklady/3.jsonld
        </Button>
      </Toolbar>
    </AppBar>
    <Board />
  </>
);
