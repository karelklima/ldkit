import React from "react";
import { Board } from "./Board";
import { Form } from "./Form";

import { CssBaseline, AppBar, Toolbar, Typography, Box } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

export const App = () => (
  <BrowserRouter>
    <CssBaseline />
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" noWrap>
          Úřední desky
        </Typography>

        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
    <Form />
    <Board />
  </BrowserRouter>
);
