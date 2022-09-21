import styled from "@emotion/styled";
import type { Component, ReactElement, ReactNode } from "react";

export const MootButton = styled.button`
  display: block;
  border: 0px solid transparent;
  background: transparent;
  border-radius: 10px;
  width: 20px;
  height: 20px;
  margin: 5px 0;
  padding: 0;
  svg {
    margin: -2px;
    fill: #ccc;
  }
`;

export const InvisibleButton = styled(MootButton)`
  visibility: hidden;
`;

export const Button = styled(MootButton)`
  background: white;
  cursor: pointer;
  &:hover svg {
    fill: #aaa;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

export const RowAction = styled.div`
  padding: 5px 0;
`;

export const RowContent = styled.div`
  flex: 1;
  padding: 2px 15px 12px;
  font-size: 18px;
`;

type GroupProps = {
  start?: ReactNode;
  content?: ReactNode;
  end?: ReactNode;
};

export const Group: React.FC<GroupProps> = ({ start, content, end }) => {
  return (
    <Row>
      <RowAction>
        {start ? start : (InvisibleButton as unknown as ReactNode)}
      </RowAction>
      <RowContent>{content}</RowContent>
      <RowAction>
        {end ? end : (InvisibleButton as unknown as ReactNode)}
      </RowAction>
    </Row>
  );
};
