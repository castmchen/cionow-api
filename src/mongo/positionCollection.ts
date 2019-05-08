import { Schema, Document } from 'mongoose';
import { baseModel } from './baseModel';

export enum positionEnum {
  MD = 0,
  OPSLEAD = 1,
  MANAGER = 2,
  PORFOLIO = 4
}

export interface positionImp extends Document {
  level: Number;
  eid: String;
  lowerPositions: Array<positionImp>;
}

const positionSchema = new Schema({
  level: { type: Number, required: true },
  eid: { type: String, required: true },
  lowerPositions: { type: [Schema.Types.Mixed], required: false }
});

positionSchema.on('index', error => {
  console.error(
    `An error has been occured while processing position schema information, Details: ${error}`
  );
});

positionSchema.on('save', next => {
  next();
});

class positionModel extends baseModel<positionImp> {}

export const positionCollection = new positionModel(
  'cionow_position',
  positionSchema
);
