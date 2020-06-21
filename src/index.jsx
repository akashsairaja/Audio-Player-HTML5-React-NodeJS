import React from 'react';
import ReactDOM from 'react-dom';

import { Switch, Route, BrowserRouter } from 'react-router-dom';

import App from './screen';
import StateFul from './screen/app';

import './scss/style.scss';

const Router = () => (
	<BrowserRouter>
		<Switch>
			<Route path="/" exact component={App}/>
			<Route path="/statefull" exact component={StateFul}/>
		</Switch>
	</BrowserRouter>
);

ReactDOM.render(<Router/>, document.getElementById('root-react'));
