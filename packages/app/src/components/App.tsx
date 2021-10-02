import React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Add } from "./Add";
import { Items } from "./Items";

export const App = () => (
  <>
    <CssBaseline />
    <Box display="flex" flexDirection="column" height="100vh">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">TODO List</Typography>
        </Toolbar>
      </AppBar>
      <Box flexGrow={1}>
        <Items />
      </Box>
    </Box>
    <Add />
  </>
);
