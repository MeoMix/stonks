import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#282c34',
    minHeight: '100vh',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
    alignItems: 'center',
  },

  header: {
    textAlign: 'center',
  },

  todos: {
    display: 'flex',
  },

  list: {
  }
});

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <p>
          <p>🚀🚀💎🤲💎🤲🚀🚀</p>
              When Moon?
          <p>🚀🚀💎🤲💎🤲🚀🚀</p>
        </p>
      </header>

      <div className={classes.todos}>
        TODO
        <ul className={classes.list}>
          <li>Add support for monitoring SSB sentiment</li>
          <li>Add basic calendar for tracking upcoming plays</li>
          <li>Add ability to evaluate efficacy of past-due calendar entries</li>
          <li>Stretch - add support for tracking active positions, gains, and losses</li>
        </ul>
      </div>

    </div>
  );
}

export default App;
