import StateManager from "./stateManager.js";

const initialState = { count: 0 };
const store = new StateManager(initialState);

const listener = (state) => {
  console.log("State changed:", state);
};

const unsubscribe = store.subscribe(listener);

store.setState({ count: store.getState().count + 1 });
