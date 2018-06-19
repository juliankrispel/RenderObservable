import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { interval, every, merge, of } from 'rxjs'
import { map, buffer, startWith } from 'rxjs/operators';

class RenderObservable extends Component {
  state = {
    value: null,
  }

  manageSubscription = (prevProps = {}) => {
    // this manages subscriptions if the observable prop changes
    if (this.props.observable !== prevProps.observable && this._subscription != null) {
        this._subscription.unsubscribe()
        this._subscription = null
    }

    if (this._subscription == null && this.props.observable != null) {
        this._subscription = this.props
          .observable
          .subscribe(value => this.setState({ value }))
    }
  }

  componentDidUpdate(prevProps) {
    this.manageSubscription(prevProps)
  }

  componentDidMount() {
    this.manageSubscription()
  }

  componentWillUnmount() {
    this._subscription.unsubscribe()
  }

  render() {
    return this.props.children({ value: this.state.value, value$: this.props.observable })
  }
}

class App extends Component {
  _obs$ = interval(2000).pipe(startWith(0))

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <RenderObservable
          observable={this._obs$}
        >
          {({ value, value$ }) => <div>
            <h1>{value}</h1>
            <RenderObservable
              observable={value$ && merge(value$, interval(300))}
            >
              {({ value }) => <div>
                <h1>{value}</h1>

              </div>}
            </RenderObservable>
          </div>}
        </RenderObservable>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
