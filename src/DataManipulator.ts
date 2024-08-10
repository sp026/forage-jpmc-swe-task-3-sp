import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined, // allows it to be undef also
  timestamp: Date,           // need ot match new elements (as we did in Graph.tsx)
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
      const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) /2;
      const priceDEF = (serverRespond[1].top_ask.price + serverRespond[0].top_bid.price) /2;
      const ratio = priceABC/priceDEF;
      const upperBound = 1 + 0.1;
      const lowerBound = 1 - 0.1;

      return {  // updated return values appropriatley to return what we need
        price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
        timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ? serverRespond[0].timestamp : serverRespond[1].timestamp,
      };

  }
}
