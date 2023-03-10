import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";

import {
  createInfosResource,
  DEFAULT_BOARD_IRI,
  InformationInterface,
} from "./store";
import {
  Alert,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { useSearchParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

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

const BoardContent: React.FC<{ iri: string }> = ({ iri }) => {
  const [informations, setInformations] = useState<
    InformationInterface[] | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      setInformations(null);
      const result = await createInfosResource(iri).find();
      setInformations(result);
    };
    fetchData();
  }, [setInformations, iri]);

  if (!informations) {
    return <Alert severity="info">Načítám desku z URL {iri}</Alert>;
  }

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
          {informations.map((item, index) => <Item item={item} key={index} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ErrorMessage: React.FC = () => {
  return (
    <Alert severity="error">
      Úřední desku na dané URL se nepodařilo načíst
    </Alert>
  );
};

export const Board: React.FC = () => {
  const [searchParams] = useSearchParams();
  const iri = searchParams.get("iri");

  console.log("RENDERING BOARD", iri);

  return (
    <Box marginX={2}>
      <ErrorBoundary
        FallbackComponent={ErrorMessage}
        resetKeys={[searchParams]}
      >
        <BoardContent iri={iri || DEFAULT_BOARD_IRI} />
      </ErrorBoundary>
    </Box>
  );
};
