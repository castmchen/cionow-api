import { chartRouter } from './routers/chartRouter';
import cont from './constant';
import mongoose = require('mongoose');
import * as logger from 'morgan';
import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as errorHandler from 'errorhandler';
import * as methodOverride from 'method-override';
import { rootRouter } from './routers/rootRouter';
var cors = require('cors');

export class server {
  public app: express.Application;

  public static bootstrap(): server {
    return new server();
  }

  constructor() {
    this.app = express();
    this.init();
  }

  private init() {
    this.initMongo();
  }

  private initMongo() {
    mongoose.Promise = global.Promise;
    mongoose.set('debug', false);
    console.log('-------- init mongo setting --------');
    mongoose.connect(
      cont.mongo.uri + cont.mongo.extra,
      {
        auth: {
          user: cont.mongo.user,
          password: cont.mongo.password
        },
        connectTimeoutMS: 180000,
        useNewUrlParser: true,
        useCreateIndex: true
      },
      error => {
        if (error) {
          console.error(
            `An error has been occured while connecting mongo ${
              cont.mongo.uri
            }, Details: ${error.message}`
          );
        } else {
          console.log('-------- init common setting --------');
          this.initCommon();
          console.log('-------- init router setting --------');
          this.initRouter();
          console.log('-------- init successfully --------');
        }
      }
    );
  }

  private initRouter() {
    const root: express.Router = express.Router();
    rootRouter.create(root);
    this.app.use(root);

    const chat: express.Router = express.Router();
    chartRouter.create(chat);
    this.app.use('/chart', chat);
  }

  private initCommon() {
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.set('trust proxy', ip => {
      return ip != null || ip != '';
    });

    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'pug');

    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(methodOverride());
    this.app.use(cors());
    this.app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        err.status = 404;
        next(err);
      }
    );
    this.app.use(errorHandler());
  }
}
