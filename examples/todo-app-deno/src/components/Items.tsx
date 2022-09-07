import React, { useCallback } from "react";
import styled from "@emotion/styled";

import { useResource } from "../../../../library/react.ts";

import { Todos, TodoInterface } from "../store.ts";
import { Button, InvisibleButton, Row, RowContent } from "./UI.tsx";
import { CheckedIcon, CircleIcon, RemoveIcon } from "./Icons.tsx";

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
      $id: item.$id,
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
  const resource = useResource(() => Todos.find());

  if (resource.isLoading) {
    return <List>Loading...</List>;
  }

  if (resource.isError) {
    return <List>Error loading todo list...</List>;
  }

  return (
    <List>
      {resource.data.map((item, index) => (
        <Item item={item} key={index} />
      ))}
    </List>
  );
};
