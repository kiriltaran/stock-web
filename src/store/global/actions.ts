import { actionTypes } from "./actionTypes";

const editingStart = () => ({
  type: actionTypes.EDITING_START
});

const editingFinish = () => ({
  type: actionTypes.EDITING_FINISH
});

const filteringStart = () => ({
  type: actionTypes.FILTERING_START
});

const filteringFinish = () => ({
  type: actionTypes.FILTERING_FINISH
});

export { editingStart, editingFinish, filteringStart, filteringFinish };
