# JS State Manager

This repository demonstrates handling promises in JavaScript with a custom-built state manager. It includes examples of fetching and managing data from an API, updating the DOM based on state changes, and ensuring a responsive design using Tailwind CSS.

## Features

- Simple state management
- Listener subscription for state changes
- Unsubscribe functionality
- Promise handling

## Installation

To get started with this project, clone the repository and install the dependencies:

```bash
git clone https://github.com/ZahraJiryaee/js-state-manager.git
cd js-state-manager
npm install
```

## Usage

Here's an example of how to use the StateManager:

```js
// index.js
import StateManager from "./stateManager.js";

const initialState = { count: 0 };
const store = new StateManager(initialState);

// Subscriber function
const listener = (state) => {
  console.log("State changed:", state);
};

// Subscribe to state changes
const unsubscribe = store.subscribe(listener);

// Update state
store.setState({ count: store.getState().count + 1 });

// Unsubscribe if needed
// unsubscribe();
```

## Running Tests

Here's an example of how to use the StateManager:

```bash
node src/test.js
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Acknowledgments

- [SWAPI](https://swapi.dev/) for the Star Wars API used in the example.
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS framework.
- [Font Awesome](https://fontawesome.com/) for icon library.

## Contact

For any inquiries or issues, please open an issue on this repository.
