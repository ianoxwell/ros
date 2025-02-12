import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IGraphDonutData } from './graph-donut.model';

export interface DataRef {
  label?: string;
  value: number; // percentage out of 100
  color: string;
}

@Component({
  selector: 'app-graph-doughnut',
  templateUrl: './graph-doughnut.component.html',
  styleUrls: ['./graph-doughnut.component.scss']
})

// https://codepen.io/jerrylow/pen/OJyREdw?editors=1100
export class GraphDoughnutComponent implements OnInit, OnChanges {
  @Input() config: {
    spacing?: number;
    borderWidth: string;
    size: string;
  } = { spacing: 0, borderWidth: '2rem', size: '300px' };
  @Input() labels: {
    header?: string;
    internalLabel?: string;
    internalLabelClass?: string;
    internalSubLabel?: string;
    internalSubLabelClass?: string;
  } = {};
  @Input() data: IGraphDonutData[] = [];
  numberArray: string[] = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
  sliceStyle = '';
  styleObject = {};

  ngOnInit() {
    this.changeSliceStyle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.data = [...changes.data.currentValue];
    this.changeSliceStyle();
  }

  /**
   * Set up the slices and sizes.
   */
  changeSliceStyle() {
    const total = this.data.reduce((acc, b) => acc + b.value, 0);
    if (total < 100) {
      this.data.push({
        value: 100 - total,
        color: '50,50,50'
      });
    }
    this.sliceStyle = this.data.reduce(
      (acc, b, i) =>
        acc + `--${this.numberArray[i]}: ${b.value / 100}; --doughnut-color-slice-${this.numberArray[i]}: ${b.color};`,
      ''
    );
    this.sliceStyle += `--doughnut-size: ${this.config.size}; --doughnut-border-width: ${
      this.config.borderWidth
    }; --doughnut-spacing: ${this.config.spacing ? this.config.spacing : 0};`;
  }
}
