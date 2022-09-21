import React, { useState, useRef, useCallback, KeyboardEvent } from "react";
import styled from "@emotion/styled";
import { useQueryClient } from "@tanstack/react-query";

import { Todos, getRandomId } from "../store";
import { Button, InvisibleButton, MootButton, Row, RowContent } from "./UI";

import { AddIcon, CircleIcon } from "./Icons";

const AddArea = styled.div`
  flex: 1;
`;

const AddInput = styled.input`
  font-size: 18px;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  width: 100%;
  margin: -3px;
  padding: 3px;
`;

export const Add: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleBlur = () => {
    setOpen(false);
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const inputValue = inputRef.current?.value;
      if (
        event.key === "Escape" ||
        (event.key === "Backspace" && !inputValue)
      ) {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        setOpen(false);
      } else if (event.key === "Enter" && inputValue) {
        Todos.insert({
          $id: getRandomId(),
          description: inputValue,
          done: false,
        }).then(() => {
          queryClient.invalidateQueries(["todos"]);
        });
        inputRef.current.value = "";
      }
    },
    [inputRef, setOpen, queryClient]
  );

  if (isOpen) {
    return (
      <Row>
        <MootButton>
          <CircleIcon />
        </MootButton>
        <RowContent>
          <AddInput
            type="text"
            autoFocus
            ref={inputRef}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
        </RowContent>
        <InvisibleButton />
      </Row>
    );
  }

  return (
    <AddArea onClick={handleClickOpen}>
      <Row>
        <Button>
          <AddIcon />
        </Button>
      </Row>
    </AddArea>
  );
};
