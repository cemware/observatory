import styled from "styled-components";

export const Wrapper = styled.div`
  flex: 1;
  user-select: none;
`;

export const GroupTitle = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
  position: relative;
  padding: 0px 20px;
  background-color: #efefef;
  color: black;
  font-size: 14px;
  font-weight: 600;
`;

export const GroupContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PropertyRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  font-size: 14px;
`;