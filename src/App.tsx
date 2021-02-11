import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

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
});

type Post = {
  id: string,
  link: string,
  text: string,
  score: number,
}

function App() {
  const classes = useStyles();
  const [topPostData, setTopPostData] = useState<Post[]>([]);

  useEffect(() => {
    async function loadReddit() {
      const { data: { ssb } } = await axios.get('http://localhost:8000/ssb');

      setTopPostData(ssb);
    }

    loadReddit();
  }, []);

  const [ethereumPrice, setEthereumPrice] = useState<number>(0);
  useEffect(() => {
    async function loadCoinGecko() {
      const { data: { ethereum } } = await axios.get('http://localhost:8000/coingecko');

      setEthereumPrice(ethereum.usd);
    }

    loadCoinGecko();
  }, []);

  const [counter, setCounter] = useState<number>(-1);
  useEffect(() => {
    async function loadCounter() {
      const { data: { counter } } = await axios.get('http://localhost:8000/counter');

      setCounter(counter);
    }

    loadCounter();
  }, []);

  async function handleClick() {
    const { data: { counter } } = await axios.post('http://localhost:8000/counter');

    setCounter(counter);
  }

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <p>🚀🚀💎🤲💎🤲🚀🚀</p>
            Ethereum is ${ethereumPrice} <br />
            When Moon?
        <p>🚀🚀💎🤲💎🤲🚀🚀</p>
      </header>

      <div>
        Counter: {counter}
        <Button onClick={handleClick}>Increment Counter</Button>
      </div>

      <div className={classes.todos}>
        TODO
        <ul>
          <li>Add support for monitoring SSB sentiment</li>
          <li>Add helpful pricing information for favorite coins?</li>
          <li>Add basic calendar for tracking upcoming plays</li>
          <li>Add ability to evaluate efficacy of past-due calendar entries</li>
          <li>Stretch - add support for tracking active positions, gains, and losses</li>
        </ul>
      </div>

      <div>
        <header>
          r/SatoshiStreetBets Sentiment (okay, well, actually, just some top posts for now)
        </header>
        <ul>
          {
            topPostData.map(entry => (<li key={entry.id}> {entry.text}</li>))
          }
        </ul>
      </div>
    </div>
  );
}

export default App;
