import { Router, Request, Response, NextFunction } from 'express';
import { positionCollection, positionEnum } from '../mongo/positionCollection';

export class rootRouter {
  constructor() {}

  public static create(router: Router) {
    router.get('/test', (req: Request, res: Response, next: NextFunction) => {
      res.writeHead(200, {"Content-Type": "text/plain"});
      res.end('success');
    });

    router.get(
      '/getlowerlevel',
      async (req: Request, res: Response, next: NextFunction) => {
        if (
          req.query &&
          typeof req.query.level !== 'undefined' &&
          typeof req.query.eid !== 'undefined'
        ) {
          await positionCollection
            .findMany({
              level: req.query.level,
              eid: req.query.eid
            })
            .then(result => {
              res.send(result);
              return;
            })
            .catch(error => {
              console.error(
                `An error has been occured while getting lower position information, Details: ${error}`
              );
              res.send('fail');
            });
        }
      }
    );

    router.get(
      '/getDefaultLevel',
      async (req: Request, res: Response, next: NextFunction) => {
        await positionCollection
          .findMany({ level: positionEnum.PORTFOLIO })
          .then(result => {
            res.send(result);
          });
      }
    );
  }
}
