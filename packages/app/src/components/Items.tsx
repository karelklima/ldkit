import React, { useState, useCallback } from "react";
import { useObservable, useObservableState } from "observable-hooks";
import type { Observable } from "rxjs";
import styled from "@emotion/styled";

import { Todos, TodoInterface } from "../store";
import {
  Button,
  Group,
  InvisibleButton,
  Row,
  RowAction,
  RowContent,
} from "./UI";
import { CheckedIcon, CircleIcon, RemoveIcon } from "./Icons";

const useResource = <T extends any>(
  observableInit: () => Observable<T>,
  defaultState: T
) => {
  const o$ = useObservable(observableInit);
  return useObservableState(o$, defaultState);
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Done = styled.span`
  color: #aaa;
  text-decoration: line-through;
`;

type ItemProps = { item: TodoInterface };

const Item: React.FC<ItemProps> = ({ item }) => {
  const handleDeleteClicked = useCallback(() => {
    Todos.delete(item);
  }, [item]);

  const handleCheckboxClicked = useCallback(() => {
    Todos.update({
      "@id": item["@id"],
      done: !item.done,
    });
  }, [item]);

  return (
    <Row>
      <Button onClick={handleCheckboxClicked}>
        {item.done ? <CheckedIcon /> : <CircleIcon />}
      </Button>
      <RowContent>
        {item.done ? <Done>{item.description}</Done> : item.description}
      </RowContent>
      {item.done ? (
        <Button onClick={handleDeleteClicked}>
          <RemoveIcon />
        </Button>
      ) : (
        <InvisibleButton />
      )}
    </Row>
  );
};

export const Items: React.FC = () => {
  const items = useResource(() => Todos.find(), []);
  return (
    <List>
      {items.map((item, index) => (
        <Item item={item} key={index} />
      ))}
    </List>
  );
};
