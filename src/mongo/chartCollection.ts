import { Schema, Document } from 'mongoose';
import { baseModel } from './baseModel';

export interface chartImp extends Document {
  mdEid: String;
  leaderEid: String;
  managerEid: String;
  portfolioEid: String;
  agentName: String;
  clientName: String;
  hours: String;
  eventTime: Number;
}

const chartSchema = new Schema({
  mdEid: { type: String, required: false },
  leaderEid: { type: String, required: false },
  managerEid: { type: String, required: false },
  portfolioEid: { type: String, required: false },
  agentName: { type: String, required: false },
  clientName: { type: String, required: false },
  hours: { type: String, required: false },
  eventTime: { type: Number, required: false }
});

chartSchema.on('index', error => {
  console.error(
    `An error has been occured while processing chart schema information, Details: ${error}`
  );
});

chartSchema.on('save', next => {
  next();
});

class chartModel extends baseModel<chartImp> {
  constructor(collection: string, schemaName: Schema) {
    super(collection, schemaName);
  }

  findByPeriod(periodStart: Number, periodEnd: Number): Promise<chartImp[]> {
    return this._model
      .find()
      .$where(
        `${periodStart} < this.eventTime && this.eventTime < ${periodEnd}`
      )
      .exec();
  }

  findByPositionAndPeriod(bodyInfo): Promise<chartImp[]> {
    let queryStart: number = 0;
    let queryEnd: number = 0;
    const queryInfo: any = {};
    const keys = Object.keys(bodyInfo);
    keys.forEach(p => {
      if(Object.is(p, 'periodStart')){
        queryStart = bodyInfo[p]
      }else if(Object.is(p, 'periodEnd')){
        queryEnd == bodyInfo[p]
      }else{
        Object.assign(queryInfo, {p: bodyInfo[p]})
      }
    })

    return this._model
      .find(queryInfo)
      .$where(`${queryStart} < this.eventTime && this.eventTime < ${queryEnd}`)
      .sort({ eventTime: -1 })
      .exec();
  }
}

export const chartCollection = new chartModel('cionow_chart', chartSchema);
