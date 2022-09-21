import React, { useCallback } from "react";
import styled from "@emotion/styled";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Todos, TodoInterface } from "../store";
import { Button, InvisibleButton, Row, RowContent } from "./UI";
import { CheckedIcon, CircleIcon, RemoveIcon } from "./Icons";

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
  const queryClient = useQueryClient();
  const handleDeleteClicked = useCallback(() => {
    Todos.delete(item).then(() => {
      queryClient.invalidateQueries(["todos"]);
    });
  }, [item, queryClient]);

  const handleCheckboxClicked = useCallback(() => {
    Todos.update({
      $id: item.$id,
      done: !item.done,
    }).then(() => {
      queryClient.invalidateQueries(["todos"]);
    });
  }, [item, queryClient]);

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
  const { isLoading, isError, data } = useQuery(["todos"], () => Todos.find());

  if (isLoading) {
    return <List>Loading...</List>;
  }

  if (isError) {
    return <List>Error loading todo list...</List>;
  }

  return (
    <List>
      {data.map((item, index) => (
        <Item item={item} key={index} />
      ))}
    </List>
  );
};
