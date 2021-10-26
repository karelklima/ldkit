import React from "react";
import styled from "@emotion/styled";

import { useResource } from "@ldkit/react";

import { Infos, InformationInterface } from "../store";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

type ItemProps = { item: InformationInterface };

const Item: React.FC<ItemProps> = ({ item }) => {
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>
        <IconButton href={item.url}>
          <LinkIcon />
        </IconButton>
      </TableCell>
      <TableCell component="th" scope="row">
        {item.title}
      </TableCell>
      <TableCell align="right">
        {item.published?.date.toLocaleDateString()}
      </TableCell>
      <TableCell align="right">
        {item.validUntil?.date.toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
};

export const Board: React.FC = () => {
  const items = useResource(() => Infos.find(), []);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>URL</TableCell>
            <TableCell>Název</TableCell>
            <TableCell align="right">Datum schválení</TableCell>
            <TableCell align="right">Relevantní do</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <Item item={item} key={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
