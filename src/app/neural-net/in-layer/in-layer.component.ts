import { EventEmitter, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Model } from '../layer.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Output } from '@angular/core';
import { FlaskapiService } from 'src/app/flaskapi.service';

@Component({
  selector: 'app-in-layer',
  templateUrl: './in-layer.component.html',
  styleUrls: ['./in-layer.component.css', '../../app.component.css'],
})
export class InLayerComponent implements OnInit {
  @Input() model: Model;
  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  layerEdited: number = 0;
  closeResult = '';

  LayerTypes: any = ['Dense', 'Conv2D', 'Dropout'];
  Activations: any = ['ReLU', 'Softmax', 'Sigmoid', 'Linear'];

  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  generateArrayOfNumbers(numbers: number) {
    return [...Array(numbers + 1).keys()].slice(1);
  }

  open(content) {
    this.layerEdited;
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
