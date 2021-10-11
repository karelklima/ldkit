import React from "react";
import { Add } from "./Add";
import { Items } from "./Items";

import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";

const globalStyles = css`
  * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }
  body {
    margin: 0;
    padding: 0;
    min-height: "100vh";
  }
`;

const Wrapper = styled.div`
  background: #f7f7f7;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Buffer = styled.div`
  height: 10vh;
  background: orange;
`;

const Card = styled.div`
  padding: 24px 30px;
  flex: 1;
  width: 400px;
  background: white;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  display: flex;
  flex-direction: column;
`;

const Heading = styled.h1`
  margin: 0 0 10px;
`;

export const App = () => (
  <Wrapper>
    <Global styles={globalStyles} />
    <Buffer />
    <Card>
      <Heading>TODO</Heading>
      <Items />
      <Add />
    </Card>
    <Buffer />
  </Wrapper>
);
