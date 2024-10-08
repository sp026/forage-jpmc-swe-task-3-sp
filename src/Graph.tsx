import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}


interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

interface TableData {
    price_abc: number,
    price_def: number,
    upper_bound: number,
    lower_bound: number,
    trigger_alert: number,
    ratio: number,
    timestamp: Date,

    }
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {  // configures the table view of graph, the elements here are what shown, etc
      price_abc: 'float',
      price_def: 'float', // need prices of two stocks to calc ratio.. wont be shown
      ratio: 'float',
      upper_bound: 'float',
      lower_bound: 'float', // upper & lower bounds
      timestamp: 'date', // since its in respect to time, we need a timestamp ele
      trigger_alert: 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line'); // view in graph
      elem.setAttribute('row-pivots', '["timestamp"]'); // one axis as timestamp- row pivots is x axis
      elem.setAttribute('columns', '["ratio", "upper_bound", "lower_bound", "trigger_alert"]'); // other axis has these elements
      elem.setAttribute('aggregates', JSON.stringify({
        price_abc: 'avg',
        price_def: 'avg',
        ratio: 'avg',
        upper_bound: 'avg',
        lower_bound: 'avg',
        timestamp: 'distinct count',
        trigger_alert: 'avg',
      }));
    }
  }

  componentDidUpdate() {  // whenever comopnent updates, aka getting new data
    if (this.table) {
      this.table.update([DataManipulator.generateRow(this.props.data),] as unknown as TableData);
    }
  }
}

export default Graph;
