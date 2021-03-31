import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Layer, Model } from '../layer.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FlaskapiService } from 'src/app/flaskapi.service';

@Component({
  selector: 'app-out-layer',
  templateUrl: './out-layer.component.html',
  styleUrls: ['./out-layer.component.css', '../../app.component.css'],
})
export class OutLayerComponent implements OnInit {
  @Input() model: Model;
  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  layerEdited: number;
  closeResult = '';

  constructor(
    private modalService: NgbModal,
    private flaskApiService: FlaskapiService
  ) {}

  LayerTypes: any = ['Dense', 'Conv2D', 'Dropout'];
  Activations: any = ['ReLU', 'Softmax', 'Sigmoid', 'Linear'];

  ngOnInit(): void {}

  generateArrayOfNumbers(numbers: number) {
    return [...Array(numbers + 1).keys()].slice(1);
  }

  open(content) {
    this.layerEdited = this.model.layers.length - 1;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
