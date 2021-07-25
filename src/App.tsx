import { useEffect, useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Custom } from './BasicCandlestickChart';
import { IOHLCData } from "./data/iOHLCData";
import { } from '@react-financial-charts/core';

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
    overflow: 'hidden',
  },

  header: {
    textAlign: 'center',
  },

  todos: {
    display: 'flex',
  },

  chartContainer: {
    width: '60%',
  },
});

const isDev = false;
const urlBase = isDev ? 'http://localhost:8000/' : 'https://whenmoon-stonksdb.herokuapp.com/';

function App() {
  const classes = useStyles();
  const [ethereumOHLC, setEthereumOHLC] = useState<IOHLCData[]>();

  async function reveal() {
    setDoneState('pending');

    for (let i = 0; i < 7; i++) {
      await incrementCounter();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  async function updateState(counter: number, ethereum: any, seed: number) {
    // setCounter(counter);
    setSeed(seed)

    // @ts-ignore
    const parsedData = ethereum.map(([timestamp, open, high, low, close]) => {
      return {
          date: new Date(timestamp),
          open,
          high,
          low,
          close,
      };
    });

    setEthereumOHLC(parsedData);
  }

  useEffect(() => {
    async function loadCoinGecko() {
      const { data: { ethereum  } } = await axios.get(`${urlBase}coingecko`);

      // @ts-ignore
      const parsedData = ethereum.map(([timestamp, open, high, low, close]) => {
        return {
            date: new Date(timestamp),
            open,
            high,
            low,
            close,
        };
      });

      setEthereumOHLC(parsedData);
    }

    loadCoinGecko();
  }, []);

  const [streak, setStreak] = useState<number>(0);
  useEffect(() => {
    async function loadCounter() {
      const { data: { counter, ethereum, seed  } } = await axios.get(`${urlBase}counter`);

      await updateState(counter, ethereum, seed);
    }

    loadCounter();
  }, []);

  const [doneState, setDoneState] = useState<'win' | 'lose' | 'push' | 'pending' | 'deciding' | undefined>();

  const goalRef = useRef<'now' | 'later'>();
  async function handleNowClick() {
    goalRef.current = 'now';
    await reveal();

    setDoneState('deciding');
  }

  async function handleLaterClick() {
    goalRef.current = 'later';
    await reveal();
    setDoneState('deciding');
  }

  const previousCloseRef = useRef<number | undefined>()
  useEffect(() => {
    // Get the close and compare it to close, if higher - win
    if (doneState === 'pending' && previousCloseRef.current === undefined) {
      previousCloseRef.current = ethereumOHLC![ethereumOHLC!.length - 1].close;
    }

    if (doneState === 'deciding') {
      const close = ethereumOHLC![ethereumOHLC!.length - 1].close;

      if (previousCloseRef.current! > close) {
        setDoneState(goalRef.current === 'now' ? 'lose' : 'win');
      } else if (previousCloseRef.current! < close) {
        setDoneState(goalRef.current === 'now' ? 'win' : 'lose');
      } else {
        setDoneState('push');
      }
    }

    if (doneState === 'win' || doneState === 'lose' || doneState === 'push') {
      previousCloseRef.current = undefined;
    }
  }, [ethereumOHLC, doneState]);

  useEffect(() => {
    if (doneState === 'win') {
      setStreak(streak + 1);
    } else if (doneState === 'lose') {
      setStreak(0);
    }
  }, [doneState])

  async function incrementCounter() {
    const { data: { counter, ethereum, seed  } } = await axios.post(`${urlBase}counter`);

    await updateState(counter, ethereum, seed);
  }

  const [seed, setSeed] = useState<number>();
  async function handleNextChartClick() {
    const { data: { counter, ethereum, seed } } = await axios.get(`${urlBase}coingecko-random`);

    await updateState(counter, ethereum, seed);
    setDoneState(undefined);
  }

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <p>🚀🚀💎🤲💎🤲🚀🚀</p>
            When Moon?
        <p>🚀🚀💎🤲💎🤲🚀🚀</p>
      </header>

      <div>
        Streak: {streak}
      </div>
      <div>
        {doneState === 'win' ? 'YOU WON!' : ''}
        {doneState === 'lose' ? 'YOU LOST!' : ''}
      </div>

      <div>
        <Button onClick={handleNowClick} color="primary" variant="contained" disabled={doneState !== undefined}>Now</Button>
        <Button onClick={handleLaterClick} color="secondary" variant="contained" disabled={doneState !== undefined}>Later</Button>
      </div>

      <div>
        Seed: {seed}
        <Button onClick={handleNextChartClick} variant="contained">Next Chart</Button>
      </div>

      { ethereumOHLC &&
        <div className={classes.chartContainer}>
          <Custom data={ethereumOHLC} />
        </div>
      }

      <div className={classes.todos}>
        GOALS
        <ul>
          <li>✅Show chart of current Ethereum price using Coingecko API</li>
          <li>✅Show chart of random Ethereum price using Coingecko API</li>
          <li>✅Hide data on chart and add button to reveal hidden data</li>
          <li>✅Let user provide input - does hidden data go up or down</li>
          <li>✅Record user input</li>
          <li>✅Reveal hidden chart data</li>
          <li>Record result of user input + revealed data</li>
          <li>Persist results of chart</li>
          <li>Reveal statistics for all users for given chart</li>
          <li>Allow for non-Ethereum coins to be included</li>
          <li>Make shiny.</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
