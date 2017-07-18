import Home from './components/routes/Home';
import Complete from './components/routes/complete';
import NotFound from './components/routes/notfound';
import Room from './components/routes/Room';

export default [{
    exact: true,
    path: '/',
    component: Home
}, {
    path: '/complete',
    component: Complete
}, {
    exact: true,
    path: '/:room',
    component: Room
}, {
    component: NotFound
}];