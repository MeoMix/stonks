import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import snoowrap from 'snoowrap';
import RedditSecrets from './redditSecrets';

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
  },

  sentiment: {

  },

  redditSentiment: {

  }
});

const reddit = new snoowrap(RedditSecrets);

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
      const subreddit = reddit.getSubreddit("SatoshiStreetBets");
      const topPosts = await subreddit.getTop({ time: 'hour', limit: 20 });

      const topPostData = topPosts.map((post) => {
        return {
          id: post.id,
          link: post.url,
          text: post.title,
          score: post.score
        };
      });

      setTopPostData(topPostData);
    
      // const thread = await topPosts[0].expandReplies({ limit: 10, depth: 10 });
    
      // console.log("comment count", thread.comments.length);
      // thread.comments.forEach((comment) => console.log(comment.body));
    }

    loadReddit();
  }, []);

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <p>🚀🚀💎🤲💎🤲🚀🚀</p>
            When Moon?
        <p>🚀🚀💎🤲💎🤲🚀🚀</p>
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

      <div className={classes.sentiment}>
        <header className={classes.redditSentiment}>
          r/SatoshiStreetBets Sentiment (okay, well, actually, just some top posts for now)
        </header>
        <ul>
          {
            topPostData.map(entry => (<li> {entry.text}</li>))
          }
        </ul>
      </div>
    </div>
  );
}

export default App;
