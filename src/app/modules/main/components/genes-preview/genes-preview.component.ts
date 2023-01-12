import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GENE_EVENT } from '@app/core/enums/gene.enum';
import { TableItem } from '@app/core/models/gene.model';
import { GenesService } from '@app/core/services/genes.service';
import { lookup } from 'dns';
// import { EGene }

@Component({
  selector: 'genes-preview',
  templateUrl: './genes-preview.component.html',
  styleUrls: ['./genes-preview.component.scss']
})
export class GenesPreviewComponent implements OnInit {
  get yellow() { return 'rgb(255, 208, 17)' }
  get blue() { return 'rgb(222, 236, 255)' }
  get red() { return 'red' }
  constructor(private genesService: GenesService) { }

  @ViewChild('matrix') matrix!: ElementRef;

  // gene: number | undefined;
  // start: number | undefined;
  // length: number | undefined;

  tableItems: TableItem[] = [];
  // genes
  interval!: any;
  timeout!: any;

  ngOnInit(): void {
    this.genesData$();
  }

  genesData$() {
    this.genesService.geneDataChanges$.subscribe(e => {

      const index = this.tableItems.findIndex(item => item.id == e.id);

      if (e.event == GENE_EVENT.RESET) {
        if (index) this.tableItems.splice(index, 1);
      }

      if (e.event == GENE_EVENT.RESET_ALL) {
        this.clear('all');
        return;
      }

      if (e.event != GENE_EVENT.RESET && e.value && e.value != '') {
        if (index == -1) {
          const item: TableItem = { id: e.id };
          item[e.event] = +e.value;
          this.tableItems.push(item);
          this.repaintItem('paint', this.tableItems[this.tableItems.length - 1])
          // this.changeColor(this.tableItems[this.tableItems.length - 1]);
        } else {
          this.repaintItem('clear', this.tableItems[index]);
          this.tableItems[index][e.event] = +e.value;
          this.repaintItem('paint', this.tableItems[index])
        }
      }

      // console.log(this.tableItems)
    })
  }


  repaintItem(action: 'paint' | 'clear', item: TableItem) {
    if (item.gene == undefined || item.length == undefined || item.start == undefined) return;
    console.log('item', action, item)
    console.log(this.tableItems)
    const gene = +item.gene;
    const start = +item.start;
    const length = +item.length;

    const genes = this.matrix.nativeElement.getElementsByClassName('gene');
    const cells = genes[gene].getElementsByClassName('cell');


    // Get neighbor items on the same row
    const neighborItems = this.tableItems.filter(neighborItem => {
      return neighborItem.gene == gene && neighborItem != item
    });

    // Start index of selected item
    let i = start;

    // Paint cells of selected item
    loop:
    for (; i < length + start; i++) {

      // Check if cells is not overlaping
      for (let neighborItem of neighborItems) {
        if (neighborItem.gene == undefined || neighborItem.start == undefined || neighborItem.length == undefined) continue;
        for (let j = neighborItem.start; j < neighborItem.start + neighborItem.length; j++) {
          if (j == i) {
            // If overlap occured paint cell depending on action
            if (action == 'paint') cells[i].style.backgroundColor = this.red;
            if (action == 'clear') cells[i].style.backgroundColor = this.yellow;
            continue loop;
          }
        }
      }
      console.log('index', i)
      // If overlap is not occured paint cell depending on action
      if (action == 'paint') cells[i].style.backgroundColor = this.yellow;
      if (action == 'clear') cells[i].style.backgroundColor = this.blue;
    }
  }
  clearItem(item: TableItem) {

  }

  clear(clear: 'row' | 'all', gene: number | undefined = undefined) {
    if (clear == 'row') {
      if (gene == undefined) return;
      const genes = this.matrix.nativeElement.getElementsByClassName('gene');
      for (let cell of genes[gene].getElementsByClassName('cell')) {
        cell.style.backgroundColor = this.blue;
      }
    }

  }



}
