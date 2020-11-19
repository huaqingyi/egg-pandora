import { Application } from 'egg';
import { bootstrap } from './app/pandora';

export default (app: Application) => {
    bootstrap(app);
};
