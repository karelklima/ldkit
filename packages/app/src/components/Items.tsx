import { useObservable, useObservableState } from "observable-hooks";
import type { Observable } from "rxjs";
import React, { useState, useCallback } from "react";
import { Todos, TodosInterface } from "../store";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";

const useResource = <T extends any>(
  observableInit: () => Observable<T>,
  defaultState: T
) => {
  const o$ = useObservable(observableInit);
  return useObservableState(o$, defaultState);
};

type ItemProps = { item: TodosInterface };

const Item: React.FC<ItemProps> = ({ item }) => {
  const [checked, setChecked] = useState(false);

  const handleChecked = useCallback(() => {
    setChecked(true);
    Todos.delete(item["@id"]);
  }, [item, setChecked]);

  return (
    <ListItem>
      <ListItemButton role={undefined} onClick={handleChecked} dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText primary={item.description} />
      </ListItemButton>
    </ListItem>
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
