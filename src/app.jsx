import ReactDOM from 'react-dom';
import {Router, useRouterHistory} from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';
import { syncHistoryWithStore } from 'react-router-redux';
import routingStore from './store/routing';
import { Provider } from 'react-redux'

const mount = document.getElementById('app');
let history = useRouterHistory(createHashHistory)({queryKey: false});
history = syncHistoryWithStore(history, routingStore);

import AppRoutes from './router.config';
ReactDOM.render(
  <Provider store={routingStore}>
    <Router history={history} routes={AppRoutes} />
  </Provider>,
  mount
);
