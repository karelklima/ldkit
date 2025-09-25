import React, { useCallback } from "react";
import styled from "@emotion/styled";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ACTIVE, DONE, isDone, TodoInterface, Todos } from "../store";
import { Button, DateInput, DateView, Row, RowContent } from "./UI";
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
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    });
  }, [item, queryClient]);

  const handleCheckboxClicked = useCallback(() => {
    Todos.update({
      $id: item.$id,
      state: isDone(item) ? ACTIVE : DONE,
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    });
  }, [item, queryClient]);

  const handleDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const dateValue = event.target.value;
      const dueDate = dateValue == "" ? null : new Date(dateValue);
      console.log(dueDate);
      Todos.update({
        $id: item.$id,
        dueDate,
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      });
    },
    [item, queryClient],
  );

  return (
    <Row>
      <Button onClick={handleCheckboxClicked}>
        {isDone(item) ? <CheckedIcon /> : <CircleIcon />}
      </Button>
      <RowContent>
        {isDone(item) ? <Done>{item.description}</Done> : item.description}
      </RowContent>
      {isDone(item)
        ? (
          <Button onClick={handleDeleteClicked}>
            <RemoveIcon />
          </Button>
        )
        : (
          <div>
            <DateView>
              {item.dueDate ? item.dueDate.toLocaleDateString() : null}
            </DateView>
            <DateInput onChange={handleDateChange} type="date" />
          </div>
        )}
    </Row>
  );
};

export const Items: React.FC = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["todos"],
    queryFn: () => Todos.find(),
  });

  if (isLoading) {
    return <List>Loading...</List>;
  }

  if (isError) {
    return <List>Error loading todo list...</List>;
  }

  return (
    <List>
      {data!.map((item, index) => <Item item={item} key={index} />)}
    </List>
  );
};
