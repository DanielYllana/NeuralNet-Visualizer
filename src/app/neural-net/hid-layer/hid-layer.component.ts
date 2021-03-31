import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Layer, Model } from '../layer.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FlaskapiService } from 'src/app/flaskapi.service';

@Component({
  selector: 'app-hid-layer',
  templateUrl: './hid-layer.component.html',
  styleUrls: ['./hid-layer.component.css', '../../app.component.css'],
})
export class HidLayerComponent implements OnInit {
  @Input() model: Model;
  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private flaskApiService: FlaskapiService
  ) {}

  // Backend stuff //

  public busy: boolean;

  updateLayer() {}

  manageModel() {
    this.changed.emit(null);
    this.flaskApiService.manageModel(this.model); // layer
  }

  // Frontend stuff //

  closeResult = '';

  LayerTypes: any = ['Dense', 'Conv2D', 'Dropout'];
  Activations: any = ['ReLU', 'Softmax', 'Sigmoid', 'Linear', 'TanH'];

  layerEdited: number;

  ngOnInit(): void {}

  changeLayer(e) {
    this.model.changeLayer(this.layerEdited, e);
    this.manageModel();
  }

  changeActivation(e) {
    this.model.changeActivation(this.layerEdited, e);
    this.manageModel();
  }

  changeNeurons(e: any) {
    this.model.changeNeurons(this.layerEdited, e);
    //this.model.layers[this.layerEdited].neurons = e.target.value;
    console.log(this.model.layers[this.layerEdited]);
    this.manageModel();
  }

  changeDropout(e) {
    this.model.changeDropout(this.layerEdited, e);
    this.manageModel();
  }

  open(content, layerNumber) {
    this.layerEdited = layerNumber;
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

  onAddLayer() {
    if (this.model.layers.length < 8) {
      this.model.layers.splice(
        this.model.layers.length,
        0,
        new Layer(this.model.layers.length + 1, 'Dense', 5, 'ReLU')
      );

      //console.log('Created new layer');

      // New layer
      this.manageModel();
    }
  }

  onRemoveLayer() {
    if (this.model.layers.length > 1) {
      // Delete second to last layer

      this.model.layers.splice(this.model.layers.length - 1, 1);

      this.manageModel();
    }
  }

  generateArrayOfNumbers(numbers: number) {
    return [...Array(numbers + 1).keys()].slice(1);
  }
}
