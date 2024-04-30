import React, { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Counter context
const CounterContext = React.createContext();

// Reducer function for managing counter state
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COUNT':
      return { count: action.count, mycount: action.mycount };
    case 'SET_MYCOUNT':
      return { count: action.count,mycount: action.mycount };
    case 'INCREMENT_COUNT':
      return { count: state.count + 1 ,mycount: state.mycount };
    case 'INCREMENT_MYCOUNT':
      return { count: state.count, mycount: state.mycount + 1 };
    case 'DECREMENT_COUNT':
      return { count: state.count - 1, mycount: state.mycount };
    case 'DECREMENT_MYCOUNT':
      return { count: state.count, mycount: state.mycount - 1 };
    default:
      return state;
  }
};

const Home = () => {
  const { state } = useContext(CounterContext);

  return (
    <div>
      <h1>Counter Value: {state.count}</h1>
      <Link to="/counter">Counter</Link>
      <br></br>
      <h1>MyCounter Value: {state.mycount}</h1>
      <Link to="/mycounter">MyCounter</Link>
    </div>
  );
};

const Counter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchCounter = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/counter');
      dispatch({ type: 'SET_COUNT', count: response.data.count, mycount:response.data.mycount });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  const incrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/increment');
      dispatch({ type: 'INCREMENT_COUNT'});
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/decrement');
      dispatch({ type: 'DECREMENT_COUNT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>Counter</h2>
      <p>Count: {state.count}</p>
      <p>MyCount:{state.mycount}</p>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};


const MyCounter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchMyCounter = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/mycounter');
      dispatch({ type: 'SET_MYCOUNT',count:response.data.count, mycount: response.data.mycount });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMyCounter();
  }, [fetchMyCounter]);

  const myincrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/mycounter/increment');
      dispatch({ type: 'INCREMENT_MYCOUNT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);
  
  const mydecrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/mycounter/decrement');
      dispatch({ type: 'DECREMENT_MYCOUNT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);
  

  return (
    <div>
      <h2>My Counter</h2>
      <p>Count: {state.count}</p>
      <p>MyCount: {state.mycount}</p>
      <button onClick={myincrementCounter}>MyIncrement</button>
      <button onClick={mydecrementCounter}>MyDecrement</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, mycount: 0});

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/counter">Counter</Link>
              </li>
              <li>
                <Link to="/mycounter">My Counter</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/mycounter" element={<MyCounter />} />
          </Routes>
        </div>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;
