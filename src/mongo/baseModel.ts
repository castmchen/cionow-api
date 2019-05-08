import { Document, Schema, Model, model } from 'mongoose';

export class baseModel<T extends Document> {
  protected _model: Model<T>;

  constructor(collection: string, schema: Schema) {
    if (!collection || !schema) {
      console.error('An error has been occured while init schema');
    }

    this._model = model<T>(collection, schema);
  }

  addOne(obj): Promise<T> {
    return this._model.create(obj);
  }

  addMany(arr: any[]): Promise<T[]> {
    return this._model.create(arr);
  }

  findOne(query): Promise<T> {
    return this._model.findOne(query).exec();
  }

  findMany(query): Promise<T[]> {
    return this._model.find(query).exec();
  }

  findById(id): Promise<T> {
    return this._model.findById(id).exec();
  }

  update(query, obj) {
    this._model
      .updateOne(query, obj, (err, raw) => {
        if (err) {
          console.error(
            `An error has been occured while updating document, Details: ${err}`
          );
        }
      })
      .exec();
  }
}
