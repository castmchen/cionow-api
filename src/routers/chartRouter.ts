import { Router, Request, Response, NextFunction } from 'express';
import { chartCollection } from '../mongo/chartCollection';
import {
  positionCollection,
  positionEnum
} from './../mongo/positionCollection';
import { eventService } from '../services/eventService';

export class chartRouter {
  constructor() {}

  public static create(router: Router) {
    router.post(
      '/add',
      async (req: Request, res: Response, next: NextFunction) => {
        if (req.body && typeof req.body === 'object') {
          positionCollection
            .findOne({ eid: req.body.MD })
            .then(currentPosition => {
              if (currentPosition) {
                if (
                  typeof currentPosition.lowerPositions !== 'undefined' &&
                  currentPosition.lowerPositions &&
                  currentPosition.lowerPositions.length > 0
                ) {
                  const currentOpslead = currentPosition.lowerPositions.find(
                    _ => _.eid === req.body.OpsLead
                  );
                  if (currentOpslead) {
                    if (
                      typeof currentOpslead.lowerPositions !== 'undefined' &&
                      currentOpslead.lowerPositions &&
                      currentOpslead.lowerPositions.length > 0
                    ) {
                      const currentManager = currentOpslead.lowerPositions.find(
                        _ => _.eid == req.body.Manager
                      );
                      if (currentManager) {
                        if (
                          typeof currentManager.lowerPositions !==
                            'undefined' &&
                          currentManager.lowerPositions &&
                          currentManager.lowerPositions.length > 0
                        ) {
                          const currentPorfolio = currentManager.lowerPositions.find(
                            _ => _.eid == req.body.Porfolio
                          );
                          if (!currentPorfolio) {
                            const position4 = {
                              level: positionEnum.PORFOLIO,
                              eid: req.body.Porfolio
                            };
                            currentManager.lowerPositions.push(
                              position4 as any
                            );
                          }
                        } else {
                          const position4 = {
                            level: positionEnum.PORFOLIO,
                            eid: req.body.Porfolio
                          };
                          currentManager.lowerPositions = [position4 as any];
                        }
                      } else {
                        const position4 = {
                          level: positionEnum.PORFOLIO,
                          eid: req.body.Porfolio
                        };
                        const position3 = {
                          level: positionEnum.MANAGER,
                          eid: req.body.Manager,
                          lowerPositions: [position4]
                        };
                        currentOpslead.lowerPositions.push(position3 as any);
                      }
                    } else {
                      const position4 = {
                        level: positionEnum.PORFOLIO,
                        eid: req.body.Porfolio
                      };
                      const position3 = {
                        level: positionEnum.MANAGER,
                        eid: req.body.Manager,
                        lowerPositions: [position4]
                      };
                      currentOpslead.lowerPositions = [position3 as any];
                    }
                  } else {
                    const position4 = {
                      level: positionEnum.PORFOLIO,
                      eid: req.body.Porfolio
                    };
                    const position3 = {
                      level: positionEnum.MANAGER,
                      eid: req.body.Manager,
                      lowerPositions: [position4]
                    };
                    const position2 = {
                      level: positionEnum.OPSLEAD,
                      eid: req.body.OpsLead,
                      lowerPositions: [position3]
                    };
                    currentPosition.lowerPositions.push(position2 as any);
                  }
                } else {
                  const position4 = {
                    level: positionEnum.PORFOLIO,
                    eid: req.body.Porfolio
                  };
                  const position3 = {
                    level: positionEnum.MANAGER,
                    eid: req.body.Manager,
                    lowerPositions: [position4]
                  };
                  const position2 = {
                    level: positionEnum.OPSLEAD,
                    eid: req.body.OpsLead,
                    lowerPositions: [position3]
                  };
                  currentPosition.lowerPositions = [position2 as any];
                }

                positionCollection.update(
                  { eid: req.body.MD },
                  currentPosition
                );
              } else {
                const position4 = {
                  level: positionEnum.PORFOLIO,
                  eid: req.body.Porfolio
                };
                const position3 = {
                  level: positionEnum.MANAGER,
                  eid: req.body.Manager,
                  lowerPositions: [position4]
                };
                const position2 = {
                  level: positionEnum.OPSLEAD,
                  eid: req.body.OpsLead,
                  lowerPositions: [position3]
                };
                const position1 = {
                  level: positionEnum.MD,
                  eid: req.body.MD,
                  lowerPositions: [position2]
                };
                positionCollection.addOne(position1);
              }
            });

          await chartCollection
            .addOne({
              mdEid: req.body.MD,
              leaderEid: req.body.OpsLead,
              managerEid: req.body.Manager,
              portfolioEid: req.body.Porfolio,
              agentName: req.body.AppName,
              clientName: req.body.ToolName,
              hours: req.body.HoursSaved,
              eventTime: req.body.EventTime
            })
            .then(result => {
              eventService.getInstance().triggerSocketAction(result);
              res.send('success');
            })
            .catch(error => {
              console.error(
                `An error has been occured while inserting chat information, Details: ${error}`
              );
              res.send('fail');
            });
        }
      }
    );

    router.post(
      '/addmultiple',
      async (req: Request, res: Response, next: NextFunction) => {
        if (req.body && req.body instanceof Array) {
          const chartArray: any[] = [];
          req.body.forEach(_ => {
            chartArray.push({
              mdEid: _.MD,
              leaderEid: _.OpsLead,
              managerEid: _.Manager,
              portfolioEid: _.Porfolio,
              agentName: _.AppName,
              clientName: _.ToolName,
              hours: _.HoursSaved,
              eventTime: _.EventTime
            });
          });

          await chartCollection
            .addMany(chartArray)
            .then(result => {
              eventService.getInstance().triggerSocketAction(result);
              res.send('success');
            })
            .catch(error => {
              console.error(
                `An error has been occured while inserting chat array information, Details: ${error}`
              );
              res.send('fail');
            });
        }
      }
    );

    router.post(
      '/filterbyposition',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          if (req.body && typeof req.body === 'object') {
            const queryInfo: any = {};
            for (let key in req.body) {
              if (req.body[key]) {
                queryInfo[key] = req.body[key];
              }
            }
            await chartCollection
              .findMany(queryInfo)
              .then(result => {
                res.send(result);
              })
              .catch(error => {
                console.error(
                  `An error has been occured while getting information, Details: ${error}`
                );
                res.send('fail');
              });
          }
        } catch (error) {
          console.error(
            `An error has been occured while getting information, Details: ${error}`
          );
          res.send('fail');
        }
      }
    );

    router.post(
      '/filterbypositionandperiod',
      async (req: Request, res: Response, next: NextFunction) => {
        if (req.body && typeof req.body === 'object') {
          if (typeof req.body.periodEnd === 'undefined') {
            const queryObj = {
              eventTime: {
                $lt: new Date().getTime(),
                $gt: new Date().getTime() - 1000 * 60 * 60
              }
            };
            await chartCollection.findMany(queryObj).then(result => {
              res.send(result);
            });
          } else {
            await chartCollection
              .findByPositionAndPeriod(req.body)
              .then(result => {
                res.send(result);
              })
              .catch(error => {
                console.log(
                  `An error has been occured while getting information by position and period, Details: ${error}`
                );
                res.send('fail');
              });
          }
        }
      }
    );
  }
}
